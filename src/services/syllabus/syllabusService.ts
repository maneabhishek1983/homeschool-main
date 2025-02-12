import { db } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Activity, ChildProfile, ProgressRecord } from '../../models/types';

interface SyllabusUnit {
  id: string;
  subject: string;
  yearGroup: string;
  title: string;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  activities: string[];
  assessments: {
    type: 'quiz' | 'project' | 'observation';
    description: string;
    criteria: string[];
  }[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // in minutes
  adaptivityRules: {
    skillName: string;
    threshold: number;
    action: 'advance' | 'review' | 'support';
  }[];
}

interface LearningPath {
  childId: string;
  units: {
    unitId: string;
    status: 'pending' | 'in-progress' | 'completed';
    startDate?: Date;
    completionDate?: Date;
    adaptations: {
      type: string;
      reason: string;
      appliedDate: Date;
    }[];
  }[];
  currentLevel: {
    [subject: string]: number;
  };
  recommendations: {
    unitId: string;
    reason: string;
    priority: number;
  }[];
}

class SyllabusService {
  private async getChildProfile(childId: string): Promise<ChildProfile | null> {
    const docRef = doc(db, 'children', childId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as ChildProfile) : null;
  }

  private async getChildProgress(childId: string): Promise<ProgressRecord[]> {
    const q = query(
      collection(db, 'progress_records'),
      where('childId', '==', childId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ProgressRecord);
  }

  private async getSyllabusUnits(yearGroup: string, subject: string): Promise<SyllabusUnit[]> {
    const q = query(
      collection(db, 'syllabus_units'),
      where('yearGroup', '==', yearGroup),
      where('subject', '==', subject)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as SyllabusUnit);
  }

  private calculateSkillLevels(progress: ProgressRecord[]): { [subject: string]: number } {
    const subjectScores: { [subject: string]: number[] } = {};
    
    progress.forEach(record => {
      if (!subjectScores[record.subject]) {
        subjectScores[record.subject] = [];
      }
      subjectScores[record.subject].push(record.score);
    });

    return Object.entries(subjectScores).reduce((acc, [subject, scores]) => {
      const recentScores = scores.slice(0, 5); // Consider last 5 scores
      const averageScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
      acc[subject] = Math.round(averageScore);
      return acc;
    }, {} as { [subject: string]: number });
  }

  private async generateLearningPath(
    childId: string,
    yearGroup: string,
    subjects: string[]
  ): Promise<LearningPath> {
    const child = await this.getChildProfile(childId);
    if (!child) throw new Error('Child profile not found');

    const progress = await this.getChildProgress(childId);
    const currentLevels = this.calculateSkillLevels(progress);

    const learningPath: LearningPath = {
      childId,
      units: [],
      currentLevel: currentLevels,
      recommendations: []
    };

    for (const subject of subjects) {
      const units = await this.getSyllabusUnits(yearGroup, subject);
      const sortedUnits = this.prioritizeUnits(units, currentLevels[subject] || 1);

      sortedUnits.forEach((unit, index) => {
        learningPath.units.push({
          unitId: unit.id,
          status: 'pending',
          adaptations: []
        });

        learningPath.recommendations.push({
          unitId: unit.id,
          reason: `Recommended based on current ${subject} level (${currentLevels[subject] || 1})`,
          priority: index + 1
        });
      });
    }

    return learningPath;
  }

  private prioritizeUnits(units: SyllabusUnit[], currentLevel: number): SyllabusUnit[] {
    return units.sort((a, b) => {
      // Calculate distance from current level
      const distanceA = Math.abs(a.difficulty - currentLevel);
      const distanceB = Math.abs(b.difficulty - currentLevel);

      if (distanceA !== distanceB) {
        return distanceA - distanceB; // Prioritize units closer to current level
      }

      // If distances are equal, slightly favor units above current level
      if (a.difficulty > currentLevel && b.difficulty <= currentLevel) {
        return -1;
      }
      if (b.difficulty > currentLevel && a.difficulty <= currentLevel) {
        return 1;
      }

      return 0;
    });
  }

  async updateLearningPath(childId: string, unitId: string, progress: number): Promise<void> {
    const learningPath = await this.getLearningPath(childId);
    if (!learningPath) throw new Error('Learning path not found');

    const unitIndex = learningPath.units.findIndex(u => u.unitId === unitId);
    if (unitIndex === -1) throw new Error('Unit not found in learning path');

    const unit = await this.getSyllabusUnit(unitId);
    if (!unit) throw new Error('Syllabus unit not found');

    // Update unit status based on progress
    if (progress >= 100) {
      learningPath.units[unitIndex].status = 'completed';
      learningPath.units[unitIndex].completionDate = new Date();
    } else if (progress > 0) {
      learningPath.units[unitIndex].status = 'in-progress';
      if (!learningPath.units[unitIndex].startDate) {
        learningPath.units[unitIndex].startDate = new Date();
      }
    }

    // Check adaptivity rules
    for (const rule of unit.adaptivityRules) {
      const skillLevel = learningPath.currentLevel[unit.subject] || 1;
      
      if (skillLevel < rule.threshold && rule.action === 'support') {
        learningPath.units[unitIndex].adaptations.push({
          type: 'additional_support',
          reason: `Skill level (${skillLevel}) below threshold (${rule.threshold})`,
          appliedDate: new Date()
        });
      } else if (skillLevel > rule.threshold && rule.action === 'advance') {
        // Add more challenging content
        const nextUnits = await this.getSyllabusUnits(unit.yearGroup, unit.subject);
        const challengingUnits = nextUnits.filter(u => u.difficulty > unit.difficulty);
        
        if (challengingUnits.length > 0) {
          learningPath.recommendations.unshift({
            unitId: challengingUnits[0].id,
            reason: 'Advanced based on high performance',
            priority: 1
          });
        }
      }
    }

    // Update learning path in database
    await this.saveLearningPath(learningPath);
  }

  private async getLearningPath(childId: string): Promise<LearningPath | null> {
    const docRef = doc(db, 'learning_paths', childId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as LearningPath) : null;
  }

  private async saveLearningPath(learningPath: LearningPath): Promise<void> {
    const docRef = doc(db, 'learning_paths', learningPath.childId);
    await docRef.set(learningPath);
  }

  private async getSyllabusUnit(unitId: string): Promise<SyllabusUnit | null> {
    const docRef = doc(db, 'syllabus_units', unitId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as SyllabusUnit) : null;
  }
}

export const syllabusService = new SyllabusService(); 
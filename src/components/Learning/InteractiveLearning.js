import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const InteractiveLearning = ({ subject, level }) => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    fetchResources();
  }, [subject, level]);

  const fetchResources = async () => {
    try {
      const resourcesRef = collection(db, 'learningResources');
      const q = query(
        resourcesRef,
        where('subject', '==', subject),
        where('level', '==', level)
      );
      
      const querySnapshot = await getDocs(q);
      const resourcesData = [];
      querySnapshot.forEach(doc => {
        resourcesData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      setResources(resourcesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  const handleVideoComplete = async () => {
    try {
      // Award points for completing video
      const newPoints = points + 10;
      setPoints(newPoints);
      
      // Update user's progress
      const progressRef = collection(db, 'learningProgress');
      await addDoc(progressRef, {
        userId: currentUser.uid,
        resourceId: selectedResource.id,
        type: 'video',
        completed: true,
        points: 10,
        completedAt: serverTimestamp(),
      });

      // Update user's total points
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        totalPoints: newPoints,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleQuizSubmit = async () => {
    const correctAnswers = selectedResource.quiz.questions.filter(
      (question, index) => question.correctAnswer === quizAnswers[index]
    ).length;
    
    const earnedPoints = correctAnswers * 20;
    const newPoints = points + earnedPoints;
    
    try {
      // Update user's progress
      const progressRef = collection(db, 'learningProgress');
      await addDoc(progressRef, {
        userId: currentUser.uid,
        resourceId: selectedResource.id,
        type: 'quiz',
        score: correctAnswers,
        totalQuestions: selectedResource.quiz.questions.length,
        points: earnedPoints,
        completedAt: serverTimestamp(),
      });

      // Update user's total points
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        totalPoints: newPoints,
      });

      setPoints(newPoints);
      setQuizModalVisible(false);
      setQuizAnswers([]);
      setCurrentQuizQuestion(0);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const renderVideoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={videoModalVisible}
      onRequestClose={() => setVideoModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.videoContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVideoModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Video
            source={{ uri: selectedResource?.videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            onPlaybackStatusUpdate={status => {
              if (status.didJustFinish) {
                handleVideoComplete();
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );

  const renderQuizModal = () => {
    if (!selectedResource?.quiz?.questions) return null;

    const currentQuestion = selectedResource.quiz.questions[currentQuizQuestion];
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={quizModalVisible}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.quizContainer}>
            <Text style={styles.questionNumber}>
              Question {currentQuizQuestion + 1} of {selectedResource.quiz.questions.length}
            </Text>
            
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    quizAnswers[currentQuizQuestion] === index && styles.selectedOption,
                  ]}
                  onPress={() => {
                    const newAnswers = [...quizAnswers];
                    newAnswers[currentQuizQuestion] = index;
                    setQuizAnswers(newAnswers);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    quizAnswers[currentQuizQuestion] === index && styles.selectedOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.quizButtons}>
              {currentQuizQuestion > 0 && (
                <TouchableOpacity
                  style={[styles.button, styles.prevButton]}
                  onPress={() => setCurrentQuizQuestion(prev => prev - 1)}
                >
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              {currentQuizQuestion < selectedResource.quiz.questions.length - 1 ? (
                <TouchableOpacity
                  style={[styles.button, styles.nextButton]}
                  onPress={() => setCurrentQuizQuestion(prev => prev + 1)}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.submitButton]}
                  onPress={handleQuizSubmit}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{subject} - {level}</Text>
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={24} color="#ffd700" />
          <Text style={styles.points}>{points} points</Text>
        </View>
      </View>

      <ScrollView style={styles.resourcesList}>
        {resources.map(resource => (
          <View key={resource.id} style={styles.resourceCard}>
            {resource.thumbnailUrl && (
              <Image
                source={{ uri: resource.thumbnailUrl }}
                style={styles.thumbnail}
              />
            )}
            
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceDescription}>{resource.description}</Text>
              
              <View style={styles.resourceButtons}>
                {resource.videoUrl && (
                  <TouchableOpacity
                    style={[styles.button, styles.watchButton]}
                    onPress={() => {
                      setSelectedResource(resource);
                      setVideoModalVisible(true);
                    }}
                  >
                    <Ionicons name="play" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Watch Video</Text>
                  </TouchableOpacity>
                )}
                
                {resource.quiz && (
                  <TouchableOpacity
                    style={[styles.button, styles.quizButton]}
                    onPress={() => {
                      setSelectedResource(resource);
                      setQuizModalVisible(true);
                    }}
                  >
                    <Ionicons name="help-circle" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Take Quiz</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {renderVideoModal()}
      {renderQuizModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resourcesList: {
    padding: 16,
  },
  resourceCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  resourceInfo: {
    padding: 16,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  resourceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  watchButton: {
    backgroundColor: '#0066cc',
  },
  quizButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    width: width,
    height: width * (9/16),
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  quizContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#0066cc',
  },
  optionText: {
    fontSize: 16,
    color: '#444',
  },
  selectedOptionText: {
    color: '#fff',
  },
  quizButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prevButton: {
    backgroundColor: '#666',
  },
  nextButton: {
    backgroundColor: '#0066cc',
  },
  submitButton: {
    backgroundColor: '#34c759',
  },
});

export default InteractiveLearning; 
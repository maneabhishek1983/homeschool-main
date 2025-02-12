export const activities = {
  academic: {
    literacy: [
      { id: 'lit1', name: 'Phonics - Letter Sounds', description: 'Practice letter sounds using phonics cards', duration: 20, level: 'Reception' },
      { id: 'lit2', name: 'Sight Words Practice', description: 'Learn common sight words through flashcards', duration: 15, level: 'Reception' },
      { id: 'lit3', name: 'Reading Simple Sentences', description: 'Read basic sentences with CVC words', duration: 20, level: 'Year 1' },
      { id: 'lit4', name: 'Handwriting Practice', description: 'Practice letter formation and spacing', duration: 15, level: 'Reception' },
      { id: 'lit5', name: 'Story Time and Comprehension', description: 'Listen to stories and answer questions', duration: 25, level: 'Year 1' }
    ],
    mathematics: [
      { id: 'math1', name: 'Number Recognition 1-20', description: 'Identify and write numbers 1-20', duration: 15, level: 'Reception' },
      { id: 'math2', name: 'Basic Addition to 10', description: 'Practice adding numbers up to 10', duration: 20, level: 'Reception' },
      { id: 'math3', name: 'Shape Recognition', description: 'Identify 2D and 3D shapes', duration: 20, level: 'Year 1' },
      { id: 'math4', name: 'Number Bonds', description: 'Learn number bonds to 10', duration: 15, level: 'Year 1' },
      { id: 'math5', name: 'Counting in 2s and 5s', description: 'Practice skip counting', duration: 20, level: 'Year 1' }
    ]
  },
  physical: {
    grossMotor: [
      { id: 'phys1', name: 'Balance Beam Walking', description: 'Practice walking on a line/low beam', duration: 15, level: 'Reception' },
      { id: 'phys2', name: 'Ball Skills', description: 'Throwing, catching, and rolling balls', duration: 20, level: 'Reception' },
      { id: 'phys3', name: 'Jumping and Hopping', description: 'Practice different jumping patterns', duration: 15, level: 'Year 1' },
      { id: 'phys4', name: 'Dance and Movement', description: 'Follow simple dance routines', duration: 25, level: 'Year 1' }
    ],
    fineMotor: [
      { id: 'fine1', name: 'Playdough Manipulation', description: 'Strengthen hand muscles through play', duration: 15, level: 'Reception' },
      { id: 'fine2', name: 'Scissor Skills', description: 'Practice cutting along lines', duration: 15, level: 'Reception' },
      { id: 'fine3', name: 'Bead Threading', description: 'Thread beads following patterns', duration: 20, level: 'Year 1' }
    ]
  },
  occupational: {
    selfCare: [
      { id: 'occ1', name: 'Dressing Practice', description: 'Practice buttons and zips', duration: 15, level: 'Reception' },
      { id: 'occ2', name: 'Hand Washing Routine', description: 'Learn proper hand washing', duration: 10, level: 'Reception' }
    ],
    socialSkills: [
      { id: 'soc1', name: 'Turn Taking Games', description: 'Practice sharing and taking turns', duration: 20, level: 'Reception' },
      { id: 'soc2', name: 'Group Activity', description: 'Participate in small group tasks', duration: 25, level: 'Year 1' },
      { id: 'soc3', name: 'Following Instructions', description: 'Multi-step instruction games', duration: 20, level: 'Year 1' }
    ]
  }
};

export const getActivityById = (id) => {
  for (const category of Object.values(activities)) {
    for (const subcategory of Object.values(category)) {
      const activity = subcategory.find(act => act.id === id);
      if (activity) return activity;
    }
  }
  return null;
};

export const getAllActivities = () => {
  const allActivities = [];
  Object.values(activities).forEach(category => {
    Object.values(category).forEach(subcategory => {
      allActivities.push(...subcategory);
    });
  });
  return allActivities;
};

export const getActivitiesByLevel = (level) => {
  return getAllActivities().filter(activity => activity.level === level);
};

export const getActivitiesByCategory = (category) => {
  return activities[category] || {};
}; 
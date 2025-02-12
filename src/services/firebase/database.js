// Mock activity service for development
export const activityService = {
  getActivitiesByYearGroup: async (yearGroup) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: '1',
        title: 'Basic Addition',
        description: 'Learn to add single-digit numbers',
        subject: 'Math',
        yearGroup: yearGroup,
        difficultyLevel: 1,
        icon: '➕',
        duration: 30,
        objectives: ['Understand addition concept', 'Add numbers 1-10'],
        instructionalSteps: ['Step 1: Count objects', 'Step 2: Combine groups'],
        mediaLinks: [
          { type: 'video', url: 'https://example.com/video1' }
        ]
      },
      {
        id: '2',
        title: 'Phonics Practice',
        description: 'Practice basic letter sounds',
        subject: 'English',
        yearGroup: yearGroup,
        difficultyLevel: 1,
        icon: '📚',
        duration: 25,
        objectives: ['Recognize letter sounds', 'Read simple words'],
        instructionalSteps: ['Step 1: Letter recognition', 'Step 2: Sound practice'],
        mediaLinks: [
          { type: 'audio', url: 'https://example.com/audio1' }
        ]
      },
      {
        id: '3',
        title: 'Colors and Shapes',
        description: 'Learn basic colors and shapes',
        subject: 'Art',
        yearGroup: yearGroup,
        difficultyLevel: 1,
        icon: '🎨',
        duration: 35,
        objectives: ['Identify primary colors', 'Recognize basic shapes'],
        instructionalSteps: ['Step 1: Color matching', 'Step 2: Shape drawing'],
        mediaLinks: [
          { type: 'image', url: 'https://example.com/image1' }
        ]
      }
    ];
  },

  createActivity: async (activity) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'new-activity-id-' + Date.now();
  },

  createABAActivity: async (activity) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'new-aba-activity-id-' + Date.now();
  }
}; 
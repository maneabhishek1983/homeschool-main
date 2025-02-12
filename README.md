# Homeschool Hub

A React Native mobile application for managing homeschool activities, tracking progress, and coordinating between parents and tutors.

## Features

### For Parents
- Dashboard with activity overview
- Child progress tracking by categories
- Task management for multiple children
- Tutor timesheet viewing
- Detailed activity tracking for:
  - Academic activities (Literacy & Mathematics)
  - Physical activities (Motor Skills)
  - Occupational activities (Life Skills)

### For Tutors
- Activity logging
- Timesheet entry
- Report generation

## Technical Stack

- React Native with Expo
- Firebase (Authentication, Firestore)
- Redux for state management
- React Navigation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
- Create a `.env` file in the root directory
- Add your Firebase configuration:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Run the development server:
```bash
npm start
```

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Parent/         # Parent-specific components
│   └── Tutor/          # Tutor-specific components
├── config/
│   └── firebase.js     # Firebase configuration
├── data/
│   └── activities.js   # Activity definitions
├── navigation/
│   └── TabNavigator.js # Navigation configuration
└── store/
    └── slices/         # Redux slices
```

## Key Features

### Activity Categories
- **Academic**
  - Literacy: Phonics, Sight Words, Reading, Writing
  - Mathematics: Number Recognition, Basic Operations, Shapes
- **Physical**
  - Gross Motor: Balance, Ball Skills, Movement
  - Fine Motor: Playdough, Scissor Skills, Threading
- **Occupational**
  - Self-Care: Dressing, Hygiene
  - Social Skills: Turn Taking, Group Activities

### Progress Tracking
- Weekly and monthly progress views
- Category-wise completion rates
- Detailed activity logs
- Tutor performance tracking

### Task Management
- Activity assignment
- Due date tracking
- Progress monitoring
- Custom task creation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
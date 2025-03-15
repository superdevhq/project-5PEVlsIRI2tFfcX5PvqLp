
import { Client, WorkoutPlan, NutritionPlan, Message, ProgressRecord } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    age: 32,
    height: 180,
    weight: 85,
    goals: 'Build muscle and improve overall fitness',
    notes: 'Previous shoulder injury, needs modified push exercises',
    joinDate: '2023-01-15',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    age: 28,
    height: 165,
    weight: 62,
    goals: 'Lose weight and tone up',
    notes: 'Prefers morning workouts, vegetarian diet',
    joinDate: '2023-03-22',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '(555) 456-7890',
    age: 45,
    height: 175,
    weight: 90,
    goals: 'Improve cardiovascular health and reduce blood pressure',
    notes: 'Works long hours, needs efficient workout plans',
    joinDate: '2023-02-10',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    phone: '(555) 234-5678',
    age: 24,
    height: 162,
    weight: 58,
    goals: 'Train for upcoming half marathon',
    notes: 'Former college athlete, high motivation',
    joinDate: '2023-04-05',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
  }
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Strength Building Program',
    description: 'Focus on compound movements to build overall strength',
    startDate: '2023-05-01',
    endDate: '2023-07-31',
    exercises: [
      {
        id: '1',
        name: 'Barbell Squat',
        sets: 4,
        reps: 8,
        weight: 100,
        restTime: 120,
        notes: 'Focus on depth and form'
      },
      {
        id: '2',
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 80,
        restTime: 120,
        notes: 'Use spotter for heavy sets'
      },
      {
        id: '3',
        name: 'Deadlift',
        sets: 3,
        reps: 6,
        weight: 120,
        restTime: 180,
        notes: 'Keep back straight'
      }
    ]
  },
  {
    id: '2',
    clientId: '2',
    name: 'Weight Loss Circuit',
    description: 'High intensity circuit training for maximum calorie burn',
    startDate: '2023-04-15',
    endDate: '2023-06-15',
    exercises: [
      {
        id: '1',
        name: 'Jumping Jacks',
        sets: 3,
        reps: 30,
        duration: 1,
        restTime: 30
      },
      {
        id: '2',
        name: 'Mountain Climbers',
        sets: 3,
        reps: 20,
        duration: 1,
        restTime: 30
      },
      {
        id: '3',
        name: 'Burpees',
        sets: 3,
        reps: 15,
        duration: 1,
        restTime: 45,
        notes: 'Modify if needed with step-back instead of jump'
      }
    ]
  }
];

export const mockNutritionPlans: NutritionPlan[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Muscle Building Diet',
    description: 'High protein diet to support muscle growth',
    startDate: '2023-05-01',
    endDate: '2023-07-31',
    dailyCalories: 2800,
    macros: {
      protein: 210,
      carbs: 280,
      fats: 70
    },
    meals: [
      {
        id: '1',
        name: 'Breakfast',
        time: '07:00',
        foods: [
          {
            id: '1',
            name: 'Oatmeal',
            quantity: 100,
            unit: 'g',
            calories: 350,
            protein: 15,
            carbs: 60,
            fats: 5
          },
          {
            id: '2',
            name: 'Protein Shake',
            quantity: 1,
            unit: 'serving',
            calories: 150,
            protein: 25,
            carbs: 5,
            fats: 2
          }
        ]
      },
      {
        id: '2',
        name: 'Lunch',
        time: '12:30',
        foods: [
          {
            id: '1',
            name: 'Grilled Chicken Breast',
            quantity: 200,
            unit: 'g',
            calories: 330,
            protein: 62,
            carbs: 0,
            fats: 8
          },
          {
            id: '2',
            name: 'Brown Rice',
            quantity: 150,
            unit: 'g',
            calories: 160,
            protein: 4,
            carbs: 35,
            fats: 1
          },
          {
            id: '3',
            name: 'Broccoli',
            quantity: 100,
            unit: 'g',
            calories: 55,
            protein: 3,
            carbs: 10,
            fats: 0
          }
        ]
      }
    ]
  },
  {
    id: '2',
    clientId: '2',
    name: 'Weight Loss Plan',
    description: 'Calorie-controlled diet with balanced macros',
    startDate: '2023-04-15',
    endDate: '2023-06-15',
    dailyCalories: 1600,
    macros: {
      protein: 120,
      carbs: 160,
      fats: 45
    },
    meals: [
      {
        id: '1',
        name: 'Breakfast',
        time: '08:00',
        foods: [
          {
            id: '1',
            name: 'Greek Yogurt',
            quantity: 200,
            unit: 'g',
            calories: 180,
            protein: 20,
            carbs: 10,
            fats: 5
          },
          {
            id: '2',
            name: 'Berries',
            quantity: 100,
            unit: 'g',
            calories: 50,
            protein: 1,
            carbs: 12,
            fats: 0
          }
        ]
      },
      {
        id: '2',
        name: 'Lunch',
        time: '13:00',
        foods: [
          {
            id: '1',
            name: 'Salad with Mixed Greens',
            quantity: 150,
            unit: 'g',
            calories: 30,
            protein: 2,
            carbs: 5,
            fats: 0
          },
          {
            id: '2',
            name: 'Grilled Salmon',
            quantity: 120,
            unit: 'g',
            calories: 220,
            protein: 25,
            carbs: 0,
            fats: 12
          }
        ]
      }
    ]
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    clientId: '1',
    senderId: 'trainer-1',
    senderType: 'trainer',
    content: 'How did your workout go yesterday?',
    timestamp: '2023-05-10T09:30:00Z',
    read: true
  },
  {
    id: '2',
    clientId: '1',
    senderId: '1',
    senderType: 'client',
    content: 'It was great! I managed to increase my squat weight by 5kg.',
    timestamp: '2023-05-10T10:15:00Z',
    read: true
  },
  {
    id: '3',
    clientId: '1',
    senderId: 'trainer-1',
    senderType: 'trainer',
    content: 'That\'s excellent progress! Let\'s aim to maintain that weight for all sets next time.',
    timestamp: '2023-05-10T10:30:00Z',
    read: false
  },
  {
    id: '4',
    clientId: '2',
    senderId: 'trainer-1',
    senderType: 'trainer',
    content: 'I\'ve updated your nutrition plan for next week. Please check it out when you have a moment.',
    timestamp: '2023-05-09T14:20:00Z',
    read: true
  },
  {
    id: '5',
    clientId: '2',
    senderId: '2',
    senderType: 'client',
    content: 'Thanks! I\'ll take a look this evening. By the way, I\'ve been feeling much more energetic lately.',
    timestamp: '2023-05-09T18:45:00Z',
    read: true
  }
];

export const mockProgressRecords: ProgressRecord[] = [
  {
    id: '1',
    clientId: '1',
    date: '2023-05-01',
    weight: 85,
    measurements: {
      chest: 105,
      waist: 90,
      arms: 38
    },
    notes: 'Starting measurements'
  },
  {
    id: '2',
    clientId: '1',
    date: '2023-05-15',
    weight: 84.2,
    measurements: {
      chest: 106,
      waist: 89,
      arms: 38.5
    },
    notes: 'Seeing good progress in strength'
  },
  {
    id: '3',
    clientId: '1',
    date: '2023-06-01',
    weight: 83.5,
    measurements: {
      chest: 107,
      waist: 88,
      arms: 39
    },
    notes: 'Continuing to see improvements'
  },
  {
    id: '4',
    clientId: '2',
    date: '2023-04-15',
    weight: 62,
    measurements: {
      chest: 88,
      waist: 72,
      hips: 95,
      thighs: 55
    },
    notes: 'Initial measurements'
  },
  {
    id: '5',
    clientId: '2',
    date: '2023-05-01',
    weight: 61.2,
    measurements: {
      chest: 87.5,
      waist: 71,
      hips: 94,
      thighs: 54.5
    },
    notes: 'Good progress with the new diet plan'
  },
  {
    id: '6',
    clientId: '2',
    date: '2023-05-15',
    weight: 60.5,
    measurements: {
      chest: 87,
      waist: 70,
      hips: 93.5,
      thighs: 54
    },
    notes: 'Consistent weight loss, feeling stronger'
  }
];

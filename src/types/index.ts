
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  goals: string;
  notes: string;
  joinDate: string;
  profileImage?: string;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in minutes
  restTime: number; // in seconds
  notes?: string;
}

export interface NutritionPlan {
  id: string;
  clientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dailyCalories: number;
  macros: {
    protein: number; // in grams
    carbs: number; // in grams
    fats: number; // in grams
  };
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Message {
  id: string;
  clientId: string;
  senderId: string;
  senderType: 'trainer' | 'client';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ProgressRecord {
  id: string;
  clientId: string;
  date: string;
  weight: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}

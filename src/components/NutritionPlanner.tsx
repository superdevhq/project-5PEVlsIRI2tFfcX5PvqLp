
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Utensils } from 'lucide-react';
import { Client, Food, Meal, NutritionPlan } from '@/types';
import { mockNutritionPlans } from '@/data/mockData';

interface NutritionPlannerProps {
  client: Client;
}

const NutritionPlanner = ({ client }: NutritionPlannerProps) => {
  const clientNutritionPlans = mockNutritionPlans.filter(plan => plan.clientId === client.id);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newPlan, setNewPlan] = useState<Partial<NutritionPlan>>({
    clientId: client.id,
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dailyCalories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fats: 0
    },
    meals: []
  });
  
  const [currentMeal, setCurrentMeal] = useState<Partial<Meal>>({
    name: '',
    time: '08:00',
    foods: []
  });
  
  const [currentFood, setCurrentFood] = useState<Partial<Food>>({
    name: '',
    quantity: 1,
    unit: 'serving',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const handleAddFood = () => {
    if (!currentFood.name) return;
    
    setCurrentMeal({
      ...currentMeal,
      foods: [
        ...(currentMeal.foods || []),
        {
          ...currentFood,
          id: Date.now().toString()
        } as Food
      ]
    });
    
    // Reset food form
    setCurrentFood({
      name: '',
      quantity: 1,
      unit: 'serving',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
  };

  const handleRemoveFood = (index: number) => {
    const updatedFoods = [...(currentMeal.foods || [])];
    updatedFoods.splice(index, 1);
    setCurrentMeal({
      ...currentMeal,
      foods: updatedFoods
    });
  };

  const handleAddMeal = () => {
    if (!currentMeal.name || !(currentMeal.foods && currentMeal.foods.length > 0)) return;
    
    setNewPlan({
      ...newPlan,
      meals: [
        ...(newPlan.meals || []),
        {
          ...currentMeal,
          id: Date.now().toString()
        } as Meal
      ]
    });
    
    // Reset meal form
    setCurrentMeal({
      name: '',
      time: '08:00',
      foods: []
    });
  };

  const handleRemoveMeal = (index: number) => {
    const updatedMeals = [...(newPlan.meals || [])];
    updatedMeals.splice(index, 1);
    setNewPlan({
      ...newPlan,
      meals: updatedMeals
    });
  };

  const handleSavePlan = () => {
    // In a real app, this would save to the database
    alert('Nutrition plan saved successfully!');
    setIsCreating(false);
    setNewPlan({
      clientId: client.id,
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dailyCalories: 0,
      macros: {
        protein: 0,
        carbs: 0,
        fats: 0
      },
      meals: []
    });
  };

  const generateAINutritionPlan = () => {
    // Simulate AI-generated nutrition plan
    setTimeout(() => {
      setNewPlan({
        clientId: client.id,
        name: `${client.name}'s Personalized Nutrition Plan`,
        description: `AI-generated nutrition plan based on ${client.goals}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailyCalories: client.weight * 30, // Simple calculation based on weight
        macros: {
          protein: Math.round(client.weight * 2), // 2g per kg bodyweight
          carbs: Math.round(client.weight * 3), // 3g per kg bodyweight
          fats: Math.round(client.weight * 1) // 1g per kg bodyweight
        },
        meals: [
          {
            id: '1',
            name: 'Breakfast',
            time: '08:00',
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
                name: 'Greek Yogurt',
                quantity: 150,
                unit: 'g',
                calories: 150,
                protein: 20,
                carbs: 6,
                fats: 5
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
                name: 'Grilled Chicken Breast',
                quantity: 150,
                unit: 'g',
                calories: 250,
                protein: 45,
                carbs: 0,
                fats: 6
              },
              {
                id: '2',
                name: 'Brown Rice',
                quantity: 100,
                unit: 'g',
                calories: 120,
                protein: 3,
                carbs: 25,
                fats: 1
              },
              {
                id: '3',
                name: 'Mixed Vegetables',
                quantity: 150,
                unit: 'g',
                calories: 80,
                protein: 4,
                carbs: 15,
                fats: 1
              }
            ]
          },
          {
            id: '3',
            name: 'Dinner',
            time: '19:00',
            foods: [
              {
                id: '1',
                name: 'Salmon Fillet',
                quantity: 150,
                unit: 'g',
                calories: 280,
                protein: 35,
                carbs: 0,
                fats: 15
              },
              {
                id: '2',
                name: 'Sweet Potato',
                quantity: 150,
                unit: 'g',
                calories: 130,
                protein: 2,
                carbs: 30,
                fats: 0
              },
              {
                id: '3',
                name: 'Asparagus',
                quantity: 100,
                unit: 'g',
                calories: 40,
                protein: 4,
                carbs: 7,
                fats: 0
              }
            ]
          }
        ]
      });
    }, 1500);
  };

  const calculateTotalMacros = (foods: Food[]) => {
    return foods.reduce((totals, food) => {
      return {
        calories: totals.calories + food.calories,
        protein: totals.protein + food.protein,
        carbs: totals.carbs + food.carbs,
        fats: totals.fats + food.fats
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nutrition Plans</h2>
        {!isCreating && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={generateAINutritionPlan}
            >
              <Utensils className="h-4 w-4" />
              <span>Generate AI Plan</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </Button>
          </div>
        )}
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Nutrition Plan</CardTitle>
            <CardDescription>Design a custom nutrition plan for {client.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <Input 
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="e.g., Weight Loss Diet"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <div className="flex gap-2">
                  <Input 
                    type="date"
                    value={newPlan.startDate}
                    onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                  />
                  <span className="flex items-center">to</span>
                  <Input 
                    type="date"
                    value={newPlan.endDate}
                    onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                placeholder="Describe the goals and focus of this nutrition plan"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Calories</label>
                <Input 
                  type="number"
                  value={newPlan.dailyCalories}
                  onChange={(e) => setNewPlan({
                    ...newPlan, 
                    dailyCalories: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Protein (g)</label>
                <Input 
                  type="number"
                  value={newPlan.macros?.protein}
                  onChange={(e) => setNewPlan({
                    ...newPlan, 
                    macros: {
                      ...newPlan.macros!,
                      protein: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Carbs (g)</label>
                <Input 
                  type="number"
                  value={newPlan.macros?.carbs}
                  onChange={(e) => setNewPlan({
                    ...newPlan, 
                    macros: {
                      ...newPlan.macros!,
                      carbs: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fats (g)</label>
                <Input 
                  type="number"
                  value={newPlan.macros?.fats}
                  onChange={(e) => setNewPlan({
                    ...newPlan, 
                    macros: {
                      ...newPlan.macros!,
                      fats: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Meals</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateAINutritionPlan}
                  className="flex items-center gap-2"
                >
                  <Utensils className="h-4 w-4" />
                  <span>AI Suggestions</span>
                </Button>
              </div>
              
              {newPlan.meals && newPlan.meals.length > 0 ? (
                <div className="space-y-4">
                  {newPlan.meals.map((meal, index) => {
                    const mealTotals = calculateTotalMacros(meal.foods);
                    
                    return (
                      <div key={meal.id} className="p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h4 className="font-medium">{meal.name} ({meal.time})</h4>
                            <p className="text-xs text-gray-500">
                              {mealTotals.calories} kcal • {mealTotals.protein}g protein • {mealTotals.carbs}g carbs • {mealTotals.fats}g fats
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveMeal(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <ul className="space-y-1 mt-2">
                          {meal.foods.map(food => (
                            <li key={food.id} className="text-sm flex justify-between">
                              <span>{food.quantity} {food.unit} {food.name}</span>
                              <span className="text-gray-500">{food.calories} kcal</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-gray-500">No meals added yet</p>
                </div>
              )}
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Add Meal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Meal Name</label>
                      <Input 
                        value={currentMeal.name}
                        onChange={(e) => setCurrentMeal({...currentMeal, name: e.target.value})}
                        placeholder="e.g., Breakfast"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Input 
                        type="time"
                        value={currentMeal.time}
                        onChange={(e) => setCurrentMeal({...currentMeal, time: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Foods:</h4>
                    
                    {currentMeal.foods && currentMeal.foods.length > 0 ? (
                      <ul className="space-y-2">
                        {currentMeal.foods.map((food, index) => (
                          <li key={food.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{food.name}</p>
                              <p className="text-xs text-gray-500">
                                {food.quantity} {food.unit} • {food.calories} kcal • 
                                P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveFood(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center p-4 border border-dashed rounded-md">
                        <p className="text-sm text-gray-500">No foods added yet</p>
                      </div>
                    )}
                    
                    <div className="p-3 border rounded-md">
                      <h5 className="text-sm font-medium mb-2">Add Food</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Food Name</label>
                          <Input 
                            value={currentFood.name}
                            onChange={(e) => setCurrentFood({...currentFood, name: e.target.value})}
                            placeholder="e.g., Chicken Breast"
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Quantity</label>
                            <Input 
                              type="number"
                              value={currentFood.quantity}
                              onChange={(e) => setCurrentFood({...currentFood, quantity: parseFloat(e.target.value) || 0})}
                              className="h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium">Unit</label>
                            <Input 
                              value={currentFood.unit}
                              onChange={(e) => setCurrentFood({...currentFood, unit: e.target.value})}
                              placeholder="g, ml, serving"
                              className="h-8 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Calories</label>
                          <Input 
                            type="number"
                            value={currentFood.calories}
                            onChange={(e) => setCurrentFood({...currentFood, calories: parseInt(e.target.value) || 0})}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Protein (g)</label>
                          <Input 
                            type="number"
                            value={currentFood.protein}
                            onChange={(e) => setCurrentFood({...currentFood, protein: parseInt(e.target.value) || 0})}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Carbs (g)</label>
                          <Input 
                            type="number"
                            value={currentFood.carbs}
                            onChange={(e) => setCurrentFood({...currentFood, carbs: parseInt(e.target.value) || 0})}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium">Fats (g)</label>
                          <Input 
                            type="number"
                            value={currentFood.fats}
                            onChange={(e) => setCurrentFood({...currentFood, fats: parseInt(e.target.value) || 0})}
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Button 
                          size="sm"
                          onClick={handleAddFood}
                          disabled={!currentFood.name}
                          className="w-full"
                        >
                          Add Food
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAddMeal}
                    disabled={!currentMeal.name || !(currentMeal.foods && currentMeal.foods.length > 0)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Meal to Plan</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button 
              onClick={handleSavePlan}
              disabled={!newPlan.name || !(newPlan.meals && newPlan.meals.length > 0)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Nutrition Plan</span>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientNutritionPlans.length > 0 ? (
            clientNutritionPlans.map(plan => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-gray-600">{plan.description}</p>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md mb-4">
                    <div className="text-sm">
                      <span className="font-medium">{plan.dailyCalories} kcal</span> daily
                    </div>
                    <div className="text-xs text-gray-500">
                      P: {plan.macros.protein}g • C: {plan.macros.carbs}g • F: {plan.macros.fats}g
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Meals:</h4>
                    {plan.meals.map(meal => (
                      <div key={meal.id} className="text-sm p-2 border-l-2 border-green-500 pl-3">
                        <p className="font-medium">{meal.name} ({meal.time})</p>
                        <ul className="mt-1 space-y-1">
                          {meal.foods.map(food => (
                            <li key={food.id} className="text-xs flex justify-between">
                              <span>{food.quantity} {food.unit} {food.name}</span>
                              <span className="text-gray-500">{food.calories} kcal</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">Edit Plan</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center p-12 border border-dashed rounded-md">
              <h3 className="text-lg font-medium mb-2">No Nutrition Plans Yet</h3>
              <p className="text-gray-500 mb-4">Create your first nutrition plan for {client.name}</p>
              <Button onClick={() => setIsCreating(true)}>Create Nutrition Plan</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionPlanner;

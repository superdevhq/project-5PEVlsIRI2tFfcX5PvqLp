
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreateClientAccountProps {
  onClientCreated?: (clientId: string) => void;
}

export default function CreateClientAccount({ onClientCreated }: CreateClientAccountProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, session } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: 30,
    height: 170,
    weight: 70,
    goals: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !session) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create a client account.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Log the session token for debugging
      console.log("Using session token:", session.access_token);

      // Create auth user account using admin functions to avoid session change
      const { data: adminAuthResponse, error: adminAuthError } = await supabase.functions.invoke(
        'create-client-account', 
        {
          body: {
            email: formData.email,
            password: formData.password,
            fullName: formData.name,
            trainerId: user.id,
            clientData: {
              age: formData.age,
              height: formData.height,
              weight: formData.weight,
              goals: formData.goals,
            }
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );

      if (adminAuthError) {
        console.error("Edge function error:", adminAuthError);
        throw adminAuthError;
      }
      
      if (!adminAuthResponse?.success) {
        console.error("Response error:", adminAuthResponse);
        throw new Error(adminAuthResponse?.message || "Failed to create client account");
      }

      toast({
        title: "Client account created",
        description: `${formData.name} can now login with their email and password.`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        age: 30,
        height: 170,
        weight: 70,
        goals: '',
      });

      setIsOpen(false);
      
      // Notify parent component
      if (onClientCreated && adminAuthResponse.clientId) {
        onClientCreated(adminAuthResponse.clientId);
      }
    } catch (error: any) {
      console.error('Error creating client account:', error);
      toast({
        title: "Error creating client account",
        description: error.message || "There was an error creating the client account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Create Client Account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Client Account</DialogTitle>
            <DialogDescription>
              Create an account for your client so they can log in and view their fitness plans.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password*
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right">
                Height (cm)
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goals" className="text-right">
                Goals
              </Label>
              <Input
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

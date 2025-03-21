
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  trainer: any | null;
  client: any | null;
  userType: 'trainer' | 'client' | null;
  loading: boolean;
  signIn: (email: string, password: string, userType: 'trainer' | 'client') => Promise<void>;
  signUp: (email: string, password: string, fullName: string, userType: 'trainer' | 'client') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fixUserData: () => Promise<void>;
  updateUserTypeMetadata: (userType: 'trainer' | 'client') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [trainer, setTrainer] = useState<any | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [userType, setUserType] = useState<'trainer' | 'client' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        determineUserType(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          determineUserType(session.user);
        } else {
          setTrainer(null);
          setClient(null);
          setUserType(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to determine user type from metadata and database
  const determineUserType = async (user: User) => {
    try {
      setLoading(true);
      
      // Check user metadata first for faster initial determination
      const userMetadata = user.user_metadata;
      const metadataUserType = userMetadata?.user_type as 'trainer' | 'client' | undefined;
      
      console.log('User metadata type:', metadataUserType);
      
      // Parallel queries for both trainer and client data
      const [trainerResponse, clientResponse] = await Promise.all([
        supabase
          .from('trainers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('clients')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()
      ]);
      
      // Handle trainer data
      if (trainerResponse.error) {
        console.error('Error checking trainer data:', trainerResponse.error);
      }
      
      // Handle client data
      if (clientResponse.error) {
        console.error('Error checking client data:', clientResponse.error);
      }
      
      // Log the results for debugging
      console.log('Trainer data:', trainerResponse.data);
      console.log('Client data:', clientResponse.data);
      
      // Determine user type based on database results
      if (clientResponse.data) {
        console.log('User is a client based on database');
        setClient(clientResponse.data);
        setTrainer(null);
        setUserType('client');
        
        // Update metadata if it doesn't match
        if (metadataUserType !== 'client') {
          await updateUserTypeMetadata('client');
        }
      } else if (trainerResponse.data) {
        console.log('User is a trainer based on database');
        setTrainer(trainerResponse.data);
        setClient(null);
        setUserType('trainer');
        
        // Update metadata if it doesn't match
        if (metadataUserType !== 'trainer') {
          await updateUserTypeMetadata('trainer');
        }
      } else {
        // User is neither a trainer nor a client in the database
        console.warn('User not found in either clients or trainers table');
        
        // If we have metadata, use it as a fallback
        if (metadataUserType === 'trainer' || metadataUserType === 'client') {
          console.log(`Using metadata user type: ${metadataUserType} as fallback`);
          setUserType(metadataUserType);
          
          // Show a toast notification about the issue
          toast({
            title: "Account issue detected",
            description: `Your account is set as a ${metadataUserType} but no matching record was found. Please contact support.`,
            variant: "destructive",
          });
        } else {
          // No metadata and no database record
          setTrainer(null);
          setClient(null);
          setUserType(null);
          
          // Show a toast notification about the issue
          toast({
            title: "Account issue detected",
            description: "Your account type could not be determined. Please contact support.",
            variant: "destructive",
          });
          
          // Sign out the user to prevent access
          await signOut();
        }
      }
    } catch (error) {
      console.error('Error determining user type:', error);
      toast({
        title: "Authentication error",
        description: "There was an error determining your account type. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update user type in metadata
  const updateUserTypeMetadata = async (userType: 'trainer' | 'client') => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('update-user-type', {
        body: { userType }
      });
      
      if (error) {
        console.error('Error updating user type metadata:', error);
        return;
      }
      
      console.log('User type metadata updated:', data);
    } catch (error) {
      console.error('Error updating user type metadata:', error);
    }
  };

  // Function to fix user data inconsistencies
  const fixUserData = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to fix user data',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('fix-user-data', {});
      
      if (error) {
        throw error;
      }

      toast({
        title: 'User data fixed',
        description: `Your account is now set as ${data.userType}`,
      });

      // Refresh user type
      if (user) {
        determineUserType(user);
      }
    } catch (error: any) {
      toast({
        title: 'Error fixing user data',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, userType: 'trainer' | 'client') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Set expected user type to help with initial redirection
      if (data.user) {
        // Check if the user exists in the expected table
        const tableName = userType === 'trainer' ? 'trainers' : 'clients';
        const { data: recordData, error: recordError } = await supabase
          .from(tableName)
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (recordError) {
          console.error(`Error checking ${tableName} record:`, recordError);
        }
        
        if (!recordData) {
          // User doesn't exist in the expected table
          await supabase.auth.signOut();
          throw new Error(`Your account is not registered as a ${userType}. Please check your credentials or contact support.`);
        }
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'An error occurred during sign in.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userType: 'trainer' | 'client') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Account created!',
        description: 'Please check your email to confirm your account.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'An error occurred during sign up.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setUserType(null);

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message || 'An error occurred during sign out.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a password reset link.',
      });
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'An error occurred during password reset.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    trainer,
    client,
    userType,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    fixUserData,
    updateUserTypeMetadata,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

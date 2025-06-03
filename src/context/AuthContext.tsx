
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  userName: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("AuthContext: Initializing authentication...");
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthContext: Error getting session:", error);
          if (mounted) {
            setUser(null);
            setUserName(null);
            setLoading(false);
          }
          return;
        }
        
        console.log("AuthContext: Session found:", session?.user?.email || "No session");
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserProfile(session.user);
          } else {
            setUserName(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("AuthContext: Error initializing auth:", error);
        if (mounted) {
          setUser(null);
          setUserName(null);
          setLoading(false);
        }
      }
    };

    const fetchUserProfile = async (currentUser: User) => {
      if (!mounted) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', currentUser.id)
          .maybeSingle();
        
        if (mounted) {
          if (data?.name) {
            setUserName(data.name);
          } else {
            setUserName(currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || null);
          }
        }
      } catch (error) {
        console.error("AuthContext: Error fetching profile:", error);
        if (mounted) {
          setUserName(currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || null);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthContext: Auth state change:", event, session?.user?.email || "No user");
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserName(null);
          setLoading(false);
          return;
        }
        
        setUser(session.user);
        
        if (session.user) {
          await fetchUserProfile(session.user);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("AuthContext: Attempting to sign in with:", email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("AuthContext: Sign in error:", error);
        throw error;
      }
      
      console.log("AuthContext: Sign in successful");
    } catch (error: any) {
      console.error("AuthContext: Sign in failed:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("AuthContext: Iniciando login com Google...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });

      console.log("AuthContext: Resposta do login com Google:", { data, error });

      if (error) {
        console.error("AuthContext: Erro detalhado do login com Google:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("AuthContext: Exceção no login com Google:", error);
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message || "Verifique sua conexão e tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar sua conta.",
      });

    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthContext: Starting sign out...");
      setLoading(true);
      
      // Clear local state immediately
      setUser(null);
      setUserName(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: Sign out error:", error);
        // Don't throw error, just log it
      }
      
      console.log("AuthContext: Sign out completed");
      
    } catch (error: any) {
      console.error("AuthContext: Sign out failed:", error);
      // Still clear local state even if signOut fails
      setUser(null);
      setUserName(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signInWithGoogle, signUp, signOut, userName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

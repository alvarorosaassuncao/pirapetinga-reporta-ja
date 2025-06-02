
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
    
    // Check active sessions and set the user
    const checkUser = async () => {
      try {
        console.log("AuthContext: Checking current session...");
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
        
        console.log("AuthContext: Current session:", session?.user?.email || "No session");
        
        if (mounted) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Fetch user profile data including name
            try {
              const { data } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (mounted) {
                if (data) {
                  setUserName(data.name);
                } else {
                  setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || null);
                }
              }
            } catch (profileError) {
              console.error("AuthContext: Error fetching profile:", profileError);
              if (mounted) {
                setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || null);
              }
            }
          } else {
            setUserName(null);
          }
        }
      } catch (error) {
        console.error("AuthContext: Error checking session:", error);
        if (mounted) {
          setUser(null);
          setUserName(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthContext: Auth state change:", event, session?.user?.email || "No user");
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Fetch user profile data only if not signing out
          try {
            const { data } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (mounted) {
              if (data) {
                setUserName(data.name);
              } else {
                setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || null);
              }
            }
          } catch (error) {
            console.error("AuthContext: Error fetching profile in auth change:", error);
            if (mounted) {
              setUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || null);
            }
          }
        } else {
          if (mounted) {
            setUserName(null);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
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
      setLoading(true);
      console.log("AuthContext: Attempting to sign out...");
      
      // Clear local state first
      setUser(null);
      setUserName(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: Sign out error:", error);
        throw error;
      }
      
      console.log("AuthContext: Sign out successful");
      
    } catch (error: any) {
      console.error("AuthContext: Sign out failed:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive",
      });
      throw error;
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

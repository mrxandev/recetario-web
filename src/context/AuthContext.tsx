import  { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { supabase } from '../supabaseClient';


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<Error | null>;
  signup: (email: string, password: string) => Promise<Error | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<Error | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ?? null;
  };

  const signup = async (email: string, password: string): Promise<Error | null> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ?? null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, type Profile } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      (async () => {
        if (newSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .maybeSingle();
          if (!data) {
            await supabase.from('profiles').insert({
              id: newSession.user.id,
              email: newSession.user.email ?? '',
              full_name:
                newSession.user.user_metadata?.full_name ??
                newSession.user.user_metadata?.name ??
                '',
              avatar_url: newSession.user.user_metadata?.avatar_url ??
                newSession.user.user_metadata?.picture ??
                '',
            });
            const { data: fresh } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle();
            setProfile(fresh as Profile | null);
          } else {
            setProfile(data as Profile | null);
          }
        } else {
          setProfile(null);
        }
      })();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

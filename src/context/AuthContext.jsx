import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchProfile, getCurrentSession, signInWithPassword, signOut, signUpWithPassword } from '../services/authService';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AuthContext = createContext(null);

function buildFallbackProfile(user) {
  if (!user) return null;

  return {
    id: user.id,
    role: user.user_metadata?.role ?? 'customer',
    full_name: user.user_metadata?.full_name ?? user.email ?? '',
    phone: user.user_metadata?.phone ?? '',
    is_verified: false,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: user.updated_at ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hydrateProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return null;
    }

    try {
      const fetchedProfile = await fetchProfile(currentUser.id);
      setProfile(fetchedProfile);
      return fetchedProfile;
    } catch (profileError) {
      const fallbackProfile = buildFallbackProfile(currentUser);
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  }, []);

  const bootstrap = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const currentSession = await getCurrentSession();
      setSession(currentSession ?? null);
      setUser(currentSession?.user ?? null);
      await hydrateProfile(currentSession?.user ?? null);
    } catch (bootstrapError) {
      setError(bootstrapError);
    } finally {
      setLoading(false);
    }
  }, [hydrateProfile]);

  useEffect(() => {
    bootstrap();

    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      await hydrateProfile(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [bootstrap, hydrateProfile]);

  const handleSignIn = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const data = await signInWithPassword(credentials);
      setSession(data.session ?? null);
      setUser(data.user ?? null);
      await hydrateProfile(data.user ?? null);
      return data;
    } catch (signInError) {
      setError(signInError);
      throw signInError;
    } finally {
      setLoading(false);
    }
  }, [hydrateProfile]);

  const handleSignUp = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await signUpWithPassword(payload);
      setSession(data.session ?? null);
      setUser(data.user ?? null);
      await hydrateProfile(data.user ?? null);
      return data;
    } catch (signUpError) {
      setError(signUpError);
      throw signUpError;
    } finally {
      setLoading(false);
    }
  }, [hydrateProfile]);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    return hydrateProfile(user);
  }, [hydrateProfile, user]);

  const value = useMemo(() => {
    const role = profile?.role ?? user?.user_metadata?.role ?? null;

    return {
      session,
      user,
      profile,
      loading,
      error,
      isAuthenticated: Boolean(user),
      isCustomer: role === 'customer',
      isWorker: role === 'worker',
      isAdmin: role === 'admin',
      homePath: role ? `/${role}` : '/login',
      signIn: handleSignIn,
      signUp: handleSignUp,
      signOut: handleSignOut,
      refreshProfile,
    };
  }, [error, handleSignIn, handleSignOut, handleSignUp, loading, profile, refreshProfile, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return context;
}

export default AuthContext;

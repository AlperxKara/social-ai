import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: 'individual' | 'agency') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const mountedRef = useRef(true);
  const profileCacheRef = useRef<Map<string, Profile>>(new Map());

  const fetchProfile = useCallback(async (userId: string) => {
    // Check cache first
    if (profileCacheRef.current.has(userId)) {
      const cachedProfile = profileCacheRef.current.get(userId);
      if (cachedProfile && mountedRef.current) {
        setProfile(cachedProfile);
        setLoading(false);
        setInitialized(true);
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (mountedRef.current) {
        // Cache the profile
        profileCacheRef.current.set(userId, data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setInitialized(true);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: 'individual' | 'agency') => {
    if (!initialized) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          });

        if (profileError) throw profileError;
      }
    } catch (error) {
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [initialized]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!initialized) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [initialized]);

  const signOut = useCallback(async () => {
    if (!initialized) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear cache on sign out
      profileCacheRef.current.clear();
    } catch (error) {
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [initialized]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user || !initialized) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Clear cache and refresh profile
      profileCacheRef.current.delete(user.id);
      await fetchProfile(user.id);
    } catch (error) {
      throw error;
    }
  }, [user, initialized, fetchProfile]);

  const contextValue = useMemo(() => ({
    user,
    profile,
    session,
    loading: loading || !initialized,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }), [user, profile, session, loading, initialized, signUp, signIn, signOut, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
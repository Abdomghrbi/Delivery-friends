import { requireSupabase } from './supabase';

export async function getProfiles() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProfileById(userId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId, role) {
  return updateProfile(userId, { role });
}

export async function verifyCustomer(userId, is_verified = true) {
  return updateProfile(userId, { is_verified });
}

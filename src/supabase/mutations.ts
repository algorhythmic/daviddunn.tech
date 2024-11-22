import { supabase } from '../lib/db';
import type { StreamlitApp, AppAnalytics } from '../types/schema';

// Streamlit app mutations
export async function createStreamlitApp(app: Omit<StreamlitApp, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('streamlit_apps')
    .insert(app)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStreamlitApp(
  id: string,
  app: Partial<Omit<StreamlitApp, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabase
    .from('streamlit_apps')
    .update(app)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStreamlitApp(id: string) {
  const { error } = await supabase
    .from('streamlit_apps')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Analytics mutations
export async function createAnalyticsEntry(entry: Omit<AppAnalytics, 'id' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('app_analytics')
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAnalyticsEntry(
  id: string,
  entry: Partial<Omit<AppAnalytics, 'id' | 'timestamp'>>
) {
  const { data, error } = await supabase
    .from('app_analytics')
    .update(entry)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

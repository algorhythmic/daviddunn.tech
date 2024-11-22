import { supabase } from '../lib/db';

// Streamlit app data queries
export async function getStreamlitAppData() {
  const { data, error } = await supabase
    .from('streamlit_apps')
    .select('*')
    .order('display_order');
  if (error) throw error;
  return data;
}

export async function getStreamlitAppById(id: string) {
  const { data, error } = await supabase
    .from('streamlit_apps')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// Analytics queries
export async function getAppAnalytics() {
  const { data, error } = await supabase
    .from('app_analytics')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
}

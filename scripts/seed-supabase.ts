import 'dotenv/config';
import { supabase } from '../src/lib/db';
import type { StreamlitApp } from '../src/types/schema';
import { createStreamlitApp } from '../src/supabase/mutations';

const testStreamlitApps: Omit<StreamlitApp, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'Stock Analysis Dashboard',
    description: 'Interactive dashboard for analyzing stock market data and trends',
    url: 'https://stock-analysis.streamlit.app',
    status: 'online',
    category: 'Finance',
    display_order: 1,
    last_checked: new Date()
  },
  {
    title: 'ML Model Explorer',
    description: 'Explore and visualize machine learning models and their predictions',
    url: 'https://ml-explorer.streamlit.app',
    status: 'online',
    category: 'Machine Learning',
    display_order: 2,
    last_checked: new Date()
  }
];

async function clearSupabaseData() {
  console.log('Clearing existing Supabase data...');
  
  // Clear Streamlit apps table
  await supabase.from('streamlit_apps').delete().neq('id', '');
  // Clear analytics data
  await supabase.from('app_analytics').delete().neq('id', '');
}

async function seedSupabase() {
  try {
    console.log('Starting Supabase seeding...');
    
    // Clear existing data
    await clearSupabaseData();
    
    // Insert Streamlit apps
    console.log('Inserting Streamlit apps...');
    for (const app of testStreamlitApps) {
      await createStreamlitApp(app);
    }
    
    console.log('Supabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Supabase:', error);
    process.exit(1);
  }
}

seedSupabase();

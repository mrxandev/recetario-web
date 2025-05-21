import { supabase } from '../supabaseClient';

export async function getAllRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });
console.log('Aqui estamos')
  
  if (error) throw error;
  return data;
}


export async function getFeaturedRecipes(limit = 5) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
import { supabase } from '../supabaseClient';

export async function getAllRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  
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

export async function getLatestRecipes(limit = 3) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getSpecifictRecipe(recipeId: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
  

  if (error) throw error;
  return data;
}

export async function searchRecipes(query: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,ingredients->0->descripcion.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRecipesByTimeFilter(timeFilter: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('time', timeFilter)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUniqueTimeTags() {
  const { data, error } = await supabase
    .from('recipes')
    .select('time')
    .order('time');

  if (error) throw error;
  
  // Extract unique time values
  const uniqueTimes = [...new Set(data?.map(recipe => recipe.time).filter(Boolean))];
  return uniqueTimes;
}

export async function getRecipeFilters() {
  const { data, error } = await supabase
    .from('recipes')
    .select('time, tags')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Extract unique time values
  const times = [...new Set(data?.map(recipe => recipe.time).filter(Boolean))];
  
  // Extract unique tags (if any)
  const allTags: string[] = [];
  data?.forEach(recipe => {
    if (recipe.tags && Array.isArray(recipe.tags)) {
      recipe.tags.forEach((tag: any) => {
        Object.values(tag).forEach(value => {
          if (typeof value === 'string' && !allTags.includes(value)) {
            allTags.push(value);
          }
        });
      });
    }
  });

  return { times, tags: allTags };
}
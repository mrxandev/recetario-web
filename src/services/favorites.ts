import { supabase } from '../supabaseClient';

export async function addToFavorites(userId: string, recipeId: number) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([
      { user_id: userId, recipe_id: recipeId }
    ]);

  if (error) throw error;
  return data;
}

export async function removeFromFavorites(userId: string, recipeId: number) {
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);

  if (error) throw error;
  return data;
}

export async function isFavorite(userId: string, recipeId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('recipe_id', recipeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return !!data;
}

export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      recipes (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

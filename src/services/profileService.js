import { supabase } from '../lib/supabaseClient';

/**
 * Service for managing user profiles
 * This centralizes all profile-related operations to avoid redundant code
 */
export const profileService = {
  /**
   * Get or create a user profile
   * @param {Object} user - The user object from Supabase auth
   * @returns {Promise<Object>} - The user profile object with id
   */
  async getOrCreateProfile(user) {
    if (!user) {
      console.error('[DEBUG_LOG] getOrCreateProfile called with no user');
      throw new Error('User is required');
    }

    console.log('[DEBUG_LOG] getOrCreateProfile called for user ID:', user.id);
    
    try {
      // First try to get the existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, course_of_study, created_at')
        .eq('user_id', user.id)
        .single();

      // If profile exists and has an id, return it
      if (existingProfile && existingProfile.id) {
        console.log('[DEBUG_LOG] Found existing profile:', existingProfile.id);
        return existingProfile;
      }

      // Handle the case where profile doesn't exist (PGRST116 = not found)
      // or any other error that isn't a "not found" error
      if (profileError) {
        console.log('[DEBUG_LOG] Profile error code:', profileError.code);
        console.log('[DEBUG_LOG] Profile error message:', profileError.message);
        
        if (profileError.code !== 'PGRST116') {
          console.error('[DEBUG_LOG] Error fetching profile:', profileError);
          throw profileError;
        }
      }

      console.log('[DEBUG_LOG] Creating new profile for user:', user.id);
      
      // Create new profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          course_of_study: 'Not specified'
        }])
        .select('id, full_name, email, course_of_study, created_at')
        .single();

      if (createError) {
        console.error('[DEBUG_LOG] Error creating profile:', createError);
        throw createError;
      }

      if (!newProfile || !newProfile.id) {
        console.error('[DEBUG_LOG] Created profile is invalid:', newProfile);
        throw new Error('Failed to create a valid user profile');
      }

      console.log('[DEBUG_LOG] Successfully created new profile:', newProfile.id);
      return newProfile;
    } catch (error) {
      console.error('[DEBUG_LOG] Error in getOrCreateProfile:', error);
      throw error;
    }
  },

  /**
   * Get a user profile by user ID
   * @param {string} userId - The user ID from Supabase auth
   * @returns {Promise<Object>} - The user profile object
   */
  async getProfileByUserId(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, course_of_study, created_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getProfileByUserId:', error);
      throw error;
    }
  },

  /**
   * Update a user profile
   * @param {string} profileId - The profile ID
   * @param {Object} updates - The profile updates
   * @returns {Promise<Object>} - The updated profile
   */
  async updateProfile(profileId, updates) {
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId)
        .select('id, full_name, email, course_of_study, created_at')
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
};
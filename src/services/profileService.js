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
      throw new Error('User is required');
    }

    try {
      // First try to get the existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, course_of_study, created_at')
        .eq('user_id', user.id)
        .single();

      // If profile exists, return it
      if (existingProfile) {
        return existingProfile;
      }

      // If error is not "not found", throw it
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

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
        throw createError;
      }

      return newProfile;
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
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
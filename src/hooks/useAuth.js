import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Custom hook for authentication-related functionality
 * Provides utilities for handling user authentication, session management,
 * and access control based on user type (anonymous vs. authenticated)
 * 
 * This hook centralizes authentication logic and provides a consistent way to:
 * 1. Check if a user is anonymous (using the is_anonymous flag in user metadata)
 * 2. Protect features that require a non-anonymous user
 * 3. Redirect users to login with context (return URL and feature name)
 * 4. Handle logout operations
 * 
 * Usage example:
 * ```
 * const { isAnonymousUser, checkProtectedAccess, redirectToLogin, handleLogout } = useAuth();
 * 
 * // Check if user can access a protected feature
 * const handlePurchase = () => {
 *   if (!checkProtectedAccess(session, 'Book Purchase')) {
 *     return; // User will be redirected to login
 *   }
 *   // Continue with purchase logic
 * };
 * ```
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Check if the current user is anonymous
   * @param {Object} session - The user's session object
   * @returns {boolean} - True if the user is anonymous, false otherwise
   */
  const isAnonymousUser = (session) => {
    console.log('[DEBUG_LOG] useAuth: isAnonymousUser called');
    console.log('[DEBUG_LOG] useAuth: Session exists:', !!session);
    
    if (!session || !session.user) {
      console.log('[DEBUG_LOG] useAuth: No session or user, returning false');
      return false;
    }
    
    const isAnonymous = !!session.user.user_metadata?.is_anonymous;
    console.log('[DEBUG_LOG] useAuth: User is anonymous:', isAnonymous);
    return isAnonymous;
  };

  /**
   * Handle logout and redirect to login page
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
    } catch (error) {
      console.error('Unexpected logout error:', error.message);
    } finally {
      // Always redirect to login, even if there's an error
      navigate('/login');
    }
  };

  /**
   * Check if a user can access a protected feature
   * If the user is anonymous, redirect to login with context
   * @param {Object} session - The user's session object
   * @param {string} featureName - The name of the feature being accessed
   * @returns {boolean} - True if the user can access the feature, false otherwise
   */
  const checkProtectedAccess = (session, featureName) => {
    console.log('[DEBUG_LOG] useAuth: checkProtectedAccess called for feature:', featureName);
    console.log('[DEBUG_LOG] useAuth: Session exists:', !!session);
    
    // If no session, user needs to log in
    if (!session) {
      console.log('[DEBUG_LOG] useAuth: No session, redirecting to login');
      redirectToLogin(featureName);
      return false;
    }

    console.log('[DEBUG_LOG] useAuth: Session user ID:', session.user?.id);
    console.log('[DEBUG_LOG] useAuth: Session user email:', session.user?.email);
    
    // If user is anonymous, they need to convert to a regular account
    if (isAnonymousUser(session)) {
      console.log('[DEBUG_LOG] useAuth: User is anonymous, redirecting to login');
      redirectToLogin(featureName);
      return false;
    }

    // User is authenticated and not anonymous
    console.log('[DEBUG_LOG] useAuth: User has access to protected feature:', featureName);
    return true;
  };

  /**
   * Redirect to login page with context
   * @param {string} featureName - The name of the feature being accessed
   */
  const redirectToLogin = (featureName) => {
    console.log('[DEBUG_LOG] useAuth: redirectToLogin called for feature:', featureName);
    
    // Encode the current path and feature name in the URL
    const returnUrl = encodeURIComponent(location.pathname);
    const feature = encodeURIComponent(featureName || '');
    
    console.log('[DEBUG_LOG] useAuth: Redirecting to login with returnUrl:', location.pathname);
    console.log('[DEBUG_LOG] useAuth: Redirecting to login with feature:', featureName || '');
    
    navigate(`/login?returnUrl=${returnUrl}&feature=${feature}`);
  };

  return { 
    handleLogout,
    isAnonymousUser,
    checkProtectedAccess,
    redirectToLogin
  };
};

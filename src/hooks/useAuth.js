import { supabase } from '../lib/supabaseClient';

export const useAuth = () => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
      } else {
        console.log('Logged out successfully');
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      alert('Unexpected error occurred. Please try again.');
    }
  };

  return { handleLogout };
};
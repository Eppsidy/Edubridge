import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First check if there's an active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, just redirect to login
        navigate('/login');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
      // Still redirect to login even if there's an error
      navigate('/login');
    }
  };

  return { handleLogout };
};
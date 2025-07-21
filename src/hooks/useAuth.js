import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

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

  return { handleLogout };
};

// Login.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import { profileService } from '../services/profileService';
import '../styles/Login.css';

/**
 * Login component that handles user authentication
 * Supports regular login, signup, and anonymous login
 * Also handles redirects with context (returnUrl and feature)
 * 
 * Authentication Flow:
 * 1. Regular Authentication:
 *    - Users can sign up or log in with email/password
 *    - Social login options (Google, GitHub) are available
 *    - After authentication, users are redirected based on context
 * 
 * 2. Anonymous Authentication:
 *    - Users can browse as guests with limited access
 *    - System generates random credentials and marks user as anonymous
 *    - Anonymous users can be prompted to create full accounts later
 * 
 * 3. Context-Aware Redirects:
 *    - When redirected from protected features, shows context message
 *    - After login, redirects back to the original feature if available
 *    - Handles different redirects for anonymous vs. regular users
 * 
 * Security Considerations:
 * - Anonymous users have read-only access to public data
 * - Protected features require full authentication
 * - User metadata stores the anonymous status flag
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contextMessage, setContextMessage] = useState('');
  
  // Parse query parameters for returnUrl and feature
  const queryParams = new URLSearchParams(location.search);
  const returnUrl = queryParams.get('returnUrl');
  const feature = queryParams.get('feature');
  
  // Show context message if redirected from a protected feature
  useEffect(() => {
    if (feature) {
      setContextMessage(`Please log in or create an account to access ${feature}.`);
    }
  }, [feature]);

  /**
   * Handle anonymous login
   * Creates a temporary user with random credentials and is_anonymous flag
   * 
   * Implementation details:
   * 1. Generates a random identifier for the email and password
   * 2. Creates a temporary email in the format: anonymous_[random]@edubridge.temp
   * 3. Creates a secure random password with the format: Anon[random]![timestamp]
   * 4. Signs up the user with these credentials and sets is_anonymous flag in metadata
   * 5. If signup doesn't create a session (e.g., email confirmation required), signs in directly
   * 6. The auth state change listener handles profile creation and navigation
   * 
   * Security considerations:
   * - Anonymous accounts use strong random passwords
   * - The is_anonymous flag clearly identifies these accounts
   * - These accounts have limited permissions through RLS policies
   * - Users can convert to regular accounts later if desired
   */
  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate a random email and password for anonymous user
      const randomId = Math.random().toString(36).substring(2, 15);
      const email = `anonymous_${randomId}@example.com`;
      const password = `Anon${randomId}!${Date.now()}`;
      
      // Sign up with the generated credentials
      const { data, error: signUpError } = await supabase.auth.signInAnonymously({
        email,
        password,
        options: {
          data: {
            full_name: `Guest User`,
            is_anonymous: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // If no session was created (e.g., email confirmation required), sign in directly
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
      }
      
      // Auth state change listener will handle the rest (profile creation and navigation)
      
    } catch (err) {
      console.error('Error during anonymous login:', err.message);
      setError('Failed to create anonymous session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle auth state changes
   * Creates user profile and redirects based on user type and context
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
          try {
            // Use profileService to get or create user profile
            await profileService.getOrCreateProfile(session.user);
            
            // Determine where to redirect the user
            if (returnUrl && !session.user.user_metadata?.is_anonymous) {
              // If there's a returnUrl and user is not anonymous, go there
              navigate(decodeURIComponent(returnUrl));
            } else if (session.user.user_metadata?.is_anonymous) {
              // Anonymous users go to user dashboard
              navigate('/userdashboard');
            } else {
              // Regular users go to home by default
              navigate('/');
            }
          } catch (err) {
            console.error('Error creating/retrieving user profile:', err.message);
            setError('Failed to create user profile. Please try again.');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, returnUrl]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-section">
          <div className="logo-icon">EB</div>
          <h1 className="logo-text">EDUBRIDGE</h1>
          <p className="logo-subtitle">Your Student-Powered Learning Hub</p>
        </div>

        {contextMessage && (
          <div className="context-message" style={{ color: '#008080', margin: '10px 0', padding: '10px', backgroundColor: '#e6f7f7', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>
            {contextMessage}
          </div>
        )}

        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '4px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#008080',
                  brandAccent: '#20B2AA',
                }
              }
            }
          }}
          theme="default"
          providers={['google', 'github']}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email Address',
                password_label: 'Password',
                button_label: 'Sign In',
                link_text: 'Already have an account? Sign in'
              },
              sign_up: {
                email_label: 'Email Address',
                password_label: 'Create Password',
                button_label: 'Create Account',
                link_text: "Don't have an account? Sign up"
              }
            }
          }}
        />
        
        <div className="anonymous-login-section">
          <div className="divider">
            <span>OR</span>
          </div>
          
          <button 
            className="anonymous-login-button" 
            onClick={handleAnonymousLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="button-spinner"></div>
            ) : (
              'Continue as Guest'
            )}
          </button>
          
          <p className="anonymous-login-note">
            No account needed. Browse and explore without registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
// Login.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import { profileService } from '../services/profileService';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle anonymous login
  const handleAnonymousLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate a random email and password for anonymous user
      const randomId = Math.random().toString(36).substring(2, 15);
      const email = `anonymous_${randomId}@edubridge.temp`;
      const password = `Anon${randomId}!${Date.now()}`;
      
      // Sign up with the generated credentials
      const { data, error: signUpError } = await supabase.auth.signUp({
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

 useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        try {
          // Use profileService to get or create user profile
          await profileService.getOrCreateProfile(session.user);
          
          // Redirect after successful login/signup/profile creation
          // Check if user is anonymous and redirect to dashboard, otherwise to home
          if (session.user.user_metadata?.is_anonymous) {
            navigate('/dashboard');
          } else {
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
}, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-section">
          <div className="logo-icon">EB</div>
          <h1 className="logo-text">EDUBRIDGE</h1>
          <p className="logo-subtitle">Your Student-Powered Learning Hub</p>
        </div>

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

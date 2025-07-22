// Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();

 useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        const userId = session.user.id;

        try {
          // Check if user profile exists in 'profiles' table
          const { data: existingProfile, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

          if (!existingProfile && !error) {
            // Insert new user profile
            await supabase.from('profiles').insert({
              user_id: userId,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || ''
            });
          }
        } catch (err) {
          console.error('Error checking/inserting user profile:', err.message);
        }

        // Redirect after successful login/signup/profile creation
        navigate('/');
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
      </div>
    </div>
  );
}

export default Login;

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
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Redirect to homepage after successful login
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
        
        <h2 className="auth-title">Welcome Back</h2>
        
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
                link_text: "Don't have an account? Sign up"
              },
              sign_up: {
                email_label: 'Email Address',
                password_label: 'Create Password',
                button_label: 'Create Account',
                link_text: 'Already have an account? Sign in'
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default Login;
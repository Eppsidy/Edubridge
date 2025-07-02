import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import '../styles/Login.css';

function Login() {
  return (
      <div className="auth-container">
        <h2>Login</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={[]}
          redirectTo="http://localhost:3000/"
        />
      </div>
    
  );
}

export default Login;
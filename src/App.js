// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Login from './pages/Login';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import TextbookMarket from './pages/TextbookMarket';
import Addbook from './pages/Addbook';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/userdashboard" /> : <Login />} />
          <Route path="/" element={session ? <Home session={session} /> : <Navigate to="/login" />} />   {/* <-- Add this line */}
          <Route path="/home" element={session ? <Home session={session} /> : <Navigate to="/login" />} />
          <Route path="/userdashboard" element={session ? <UserDashboard session={session} /> : <Navigate to="/login" />} />
          <Route path="/textbookmarket" element={session ? <TextbookMarket session={session} /> : <Navigate to="/login" />} />
          <Route path="/addbook" element={session ? <Addbook session={session} /> : <Navigate to="/login" />} />
          <Route path="/cart" element={session ? <div>Cart - Coming Soon</div> : <Navigate to="/login" />} />
          <Route path="/sale" element={session ? <div>Sale - Coming Soon</div> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
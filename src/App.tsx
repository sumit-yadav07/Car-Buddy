import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import CarDetail from './pages/CarDetail';
import CarForm from './components/CarForm';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/cars/new"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-8">Add New Car</h2>
                  <CarForm onCancel={() => window.history.back()} />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/cars/:id"
          element={
            <PrivateRoute>
              <CarDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
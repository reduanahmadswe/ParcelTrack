import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Google authentication failed. Please try again.');
        navigate('/login');
        return;
      }

      if (token && refreshToken) {
        try {
          // Store tokens
          localStorage.setItem('accessToken', token);
          localStorage.setItem('refreshToken', refreshToken);

          // Fetch user data
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.data.user;

            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify(user));

            toast.success(`Welcome, ${user.name}!`);

            // Navigate to dashboard
            const dashboardPath = 
              user.role === 'admin' ? '/admin/dashboard' :
              user.role === 'sender' ? '/sender/dashboard' :
              user.role === 'receiver' ? '/receiver/dashboard' :
              '/';
            
            window.location.href = dashboardPath;
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Google auth error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing Google Sign In...</p>
      </div>
    </div>
  );
}

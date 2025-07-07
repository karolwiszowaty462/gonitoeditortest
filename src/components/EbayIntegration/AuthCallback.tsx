import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEbayStore } from '../../store/ebayStore';
import { Loader } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { handleAuthCallback } = useEbayStore();

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        console.error('eBay authorization error:', error);
        navigate('/ebay?error=' + encodeURIComponent(error));
        return;
      }

      if (code && state) {
        try {
          const success = await handleAuthCallback(code, state);
          if (success) {
            navigate('/ebay?connected=true');
          } else {
            navigate('/ebay?error=auth_failed');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/ebay?error=auth_failed');
        }
      } else {
        navigate('/ebay?error=missing_params');
      }
    };

    processCallback();
  }, [handleAuthCallback, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Autoryzacja eBay
        </h2>
        <p className="text-slate-400">
          Przetwarzanie autoryzacji...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
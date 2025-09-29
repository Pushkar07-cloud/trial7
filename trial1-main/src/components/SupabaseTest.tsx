import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('soil_data')
          .select('count')
          .limit(1);

        if (error) {
          setStatus('error');
          setError(error.message);
        } else {
          setStatus('success');
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  if (status === 'testing') {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Testing Supabase connection...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">Supabase Connection Error:</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <p className="text-red-600 text-xs mt-2">
          Make sure the database tables are created and Supabase is properly configured.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-green-800">✅ Supabase connection successful!</p>
    </div>
  );
};

export default SupabaseTest;

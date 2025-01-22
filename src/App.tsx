import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { DatasetAnalysis } from './components/DatasetAnalysis';
import { Shield } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useStore } from './lib/store';
import type { IntrusionAlert } from './types';

function App() {
  const setAlerts = useStore((state) => state.setAlerts);
  const addAlert = useStore((state) => state.addAlert);

  useEffect(() => {
    // Initial fetch of alerts
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('intrusion_alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }

      setAlerts(data as IntrusionAlert[]);
    };

    // Subscribe to real-time updates
    const alertsSubscription = supabase
      .channel('intrusion_alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'intrusion_alerts' },
        (payload) => {
          addAlert(payload.new as IntrusionAlert);
        }
      )
      .subscribe();

    fetchAlerts();

    return () => {
      alertsSubscription.unsubscribe();
    };
  }, [setAlerts, addAlert]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Quantum IDS
              </span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <DatasetAnalysis />
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
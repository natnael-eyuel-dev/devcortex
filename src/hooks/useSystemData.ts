import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// system data type definition
interface SystemData {
  activeUsers: number;
  totalUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  dbLatency: number;
  lastBackup: string;
  errorRate: number;
  timestamp: string;
}

// custom hook for system data
export function useSystemData() {
  const { data: session } = useSession();
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemData = async () => {
    try {
      const response = await fetch('/api/admin/system');
      if (response.ok) {
        const data = await response.json();
        setSystemData(data);
        setError(null);
      } else {
        setError('Failed to fetch system data');
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
      setError('Network error');
    }
  };

  // initial fetch on mount
  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      fetchSystemData().finally(() => setLoading(false));
    }
  }, [session]);

  // periodic refresh
  useEffect(() => {
    if (!session?.user) return;
    const interval = setInterval(fetchSystemData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [session]);

  // return system data and state
  return {
    systemData,
    loading,
    error,
    refetch: fetchSystemData
  };
} 
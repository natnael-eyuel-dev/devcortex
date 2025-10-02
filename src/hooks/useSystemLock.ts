import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// custom hook for system lock management
export function useSystemLock() {
  const { data: session } = useSession();
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch current lock status from the server
  const fetchLockStatus = async () => {
    try {
      const response = await fetch('/api/admin/system/lock');
      if (response.ok) {
        const data = await response.json();
        setIsLocked(data.systemLocked);
      }
    } catch (error) {
      console.error('Error fetching lock status:', error);
    }
  };

  // toggle lock status
  const toggleLock = async () => {
    setLoading(true);
    try {
      // Fetch current status first to avoid stale reads
      const current = await fetch('/api/admin/system/lock');
      const currentData = current.ok ? await current.json() : { systemLocked: isLocked };
      const action = currentData.systemLocked ? 'unlock' : 'lock';

      const response = await fetch('/api/admin/system/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Toggle failed: ${response.status} ${text}`);
      }

      const data = await response.json();
      setIsLocked(Boolean(data.systemLocked));
    } catch (error) {
      console.error('Error toggling system lock:', error);
      // Optionally keep previous state; ensure UI can reflect failure
    } finally {
      setLoading(false);
    }
  };

  // initial fetch on mount
  useEffect(() => {
    if (session?.user) {
      fetchLockStatus();
    }
  }, [session]);

  // periodic refresh
  useEffect(() => {
    if (!session?.user) return;
    const interval = setInterval(fetchLockStatus, 15000); // Every 15 seconds
    return () => clearInterval(interval);
  }, [session]);

  // return lock status and actions
  return {
    isLocked,
    loading,
    toggleLock
  };
} 
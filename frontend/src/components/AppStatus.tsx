import { useEffect, useState } from 'react';

type BackendStatus = 'checking' | 'connected' | 'offline';

function AppStatus() {
  const [status, setStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    async function checkBackendStatus() {
      try {
        const response = await fetch('http://localhost:3001/health');
        setStatus(response.ok ? 'connected' : 'offline');
      } catch (error) {
        console.error(error);
        setStatus('offline');
      }
    }

    void checkBackendStatus();
  }, []);

  const isConnected = status === 'connected';
  const statusText =
    status === 'checking'
      ? 'Checking backend'
      : isConnected
        ? 'Backend connected'
        : 'Backend offline';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${
        isConnected
          ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
          : 'border-amber-300/30 bg-amber-300/10 text-amber-100'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isConnected ? 'bg-emerald-300' : 'bg-amber-300'
        }`}
      />
      {statusText}
    </div>
  );
}

export default AppStatus;

import { useState } from 'react';
import { SuspenseOverlay } from 'react-suspense-overlay';
import { fetchData, invalidateAll } from './fakeApi';
import { Spinner } from './Spinner';

function UserList() {
  const users = fetchData('snapshot-users', 2000, [
    { name: 'Alice', role: 'Engineer' },
    { name: 'Bob', role: 'Designer' },
    { name: 'Charlie', role: 'PM' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {users.map((u) => (
        <div key={u.name} style={{
          padding: 12, background: '#f9fafb', borderRadius: 8,
          border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: '#4f46e5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 700,
          }}>{u.name[0]}</div>
          <div>
            <strong>{u.name}</strong>
            <div style={{ color: '#666', fontSize: 14 }}>{u.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stats() {
  const stats = fetchData('snapshot-stats', 1800, [
    { label: 'Users', value: '1,234' },
    { label: 'Revenue', value: '$56.7k' },
    { label: 'Growth', value: '+12%' },
  ]);

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          flex: 1, padding: 16, background: '#f9fafb', borderRadius: 8,
          border: '1px solid #e5e7eb', textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
          <div style={{ color: '#666', fontSize: 14 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ margin: 0 }}>Dashboard</h3>
      <Stats />
      <h3 style={{ margin: 0 }}>Team</h3>
      <UserList />
    </div>
  );
}

export function SnapshotDemo() {
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    invalidateAll();
    setKey((k) => k + 1);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Snapshot Mode</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        No <code>pending</code> prop. DOM snapshot is auto-captured.
        When children suspend, the last snapshot is shown with an overlay.
        Click "Refresh" to re-trigger suspend.
      </p>

      <button
        onClick={handleRefresh}
        style={{
          padding: '6px 16px', border: 'none', borderRadius: 4,
          background: '#4f46e5', color: '#fff', cursor: 'pointer',
          fontWeight: 600, marginBottom: 16,
        }}
      >
        Refresh (re-suspend)
      </button>

      <SuspenseOverlay
        overlay={<Spinner label="Refreshing..." />}
        overlayClassName="react-suspense-overlay"
        fallback={<SnapshotSkeleton />}
      >
        <Dashboard key={key} />
      </SuspenseOverlay>
    </div>
  );
}

function SnapshotSkeleton() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ height: 24, width: 120, background: '#e5e7eb', borderRadius: 4, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            flex: 1, height: 70, background: '#e5e7eb', borderRadius: 8,
          }} />
        ))}
      </div>
      <div style={{ height: 24, width: 80, background: '#e5e7eb', borderRadius: 4, marginBottom: 16 }} />
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          height: 64, background: '#e5e7eb', borderRadius: 8, marginBottom: 8,
        }} />
      ))}
    </div>
  );
}

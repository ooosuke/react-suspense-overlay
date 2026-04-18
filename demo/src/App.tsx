import { useState, useTransition } from 'react';
import { SuspenseOverlay } from 'react-suspense-overlay';
import '../../src/styles.css';
import { PendingDemo } from './PendingDemo';
import { SnapshotDemo } from './SnapshotDemo';

export function App() {
  const [activeTab, setActiveTab] = useState<'pending' | 'snapshot'>('pending');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>react-suspense-overlay Demo</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Two modes: <strong>Pending Mode</strong> (useTransition) and <strong>Snapshot Mode</strong> (auto DOM capture)
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '8px 20px',
            border: '2px solid #333',
            borderRadius: 6,
            background: activeTab === 'pending' ? '#333' : '#fff',
            color: activeTab === 'pending' ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Pending Mode
        </button>
        <button
          onClick={() => setActiveTab('snapshot')}
          style={{
            padding: '8px 20px',
            border: '2px solid #333',
            borderRadius: 6,
            background: activeTab === 'snapshot' ? '#333' : '#fff',
            color: activeTab === 'snapshot' ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Snapshot Mode
        </button>
      </div>

      {activeTab === 'pending' ? <PendingDemo /> : <SnapshotDemo />}
    </div>
  );
}

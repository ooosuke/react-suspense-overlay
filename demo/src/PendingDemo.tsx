import { useState, useTransition } from 'react';
import { SuspenseOverlay } from 'react-suspense-overlay';
import { fetchData, invalidate } from './fakeApi';
import { Spinner } from './Spinner';

const tabs = ['Profile', 'Posts', 'Settings'] as const;
type Tab = (typeof tabs)[number];

function TabContent({ tab }: { tab: Tab }) {
  const data = fetchData(
    `pending-${tab}`,
    1500,
    { Profile: profileData, Posts: postsData, Settings: settingsData }[tab],
  );
  return <div>{data}</div>;
}

export function PendingDemo() {
  const [tab, setTab] = useState<Tab>('Profile');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (newTab: Tab) => {
    invalidate(`pending-${newTab}`);
    startTransition(() => setTab(newTab));
  };

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Pending Mode</h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
        Uses <code>useTransition</code> + <code>pending</code> prop.
        The live UI stays interactive while the overlay shows.
      </p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => handleTabChange(t)}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: 4,
              background: tab === t ? '#4f46e5' : '#e5e7eb',
              color: tab === t ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <SuspenseOverlay
        pending={isPending}
        overlay={<Spinner label="Loading tab..." />}
        overlayClassName="react-suspense-overlay"
        fallback={<Skeleton />}
        delay={200}
      >
        <TabContent tab={tab} />
      </SuspenseOverlay>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: 20 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 20,
            background: '#e5e7eb',
            borderRadius: 4,
            marginBottom: 12,
            width: `${100 - i * 20}%`,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  );
}

const profileData = (
  <div style={{
    padding: 20,
    background: '#f9fafb',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: '#4f46e5', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700,
      }}>JD</div>
      <div>
        <h3 style={{ margin: 0 }}>Jane Doe</h3>
        <p style={{ margin: 0, color: '#666' }}>jane@example.com</p>
      </div>
    </div>
    <p>Frontend developer who loves React and TypeScript. Building great UIs one component at a time.</p>
  </div>
);

const postsData = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {['Understanding React Suspense', 'Building NPM Packages', 'CSS Animation Tips'].map((title, i) => (
      <div key={i} style={{
        padding: 16, background: '#f9fafb', borderRadius: 8,
        border: '1px solid #e5e7eb',
      }}>
        <h4 style={{ margin: '0 0 4px' }}>{title}</h4>
        <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Published {3 - i} days ago · 5 min read</p>
      </div>
    ))}
  </div>
);

const settingsData = (
  <div style={{
    padding: 20, background: '#f9fafb', borderRadius: 8,
    border: '1px solid #e5e7eb',
  }}>
    <h3 style={{ marginTop: 0 }}>Settings</h3>
    {['Dark Mode', 'Notifications', 'Auto-save'].map((setting) => (
      <label key={setting} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 0', borderBottom: '1px solid #e5e7eb',
      }}>
        <input type="checkbox" defaultChecked={setting !== 'Dark Mode'} />
        {setting}
      </label>
    ))}
  </div>
);

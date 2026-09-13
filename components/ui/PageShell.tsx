'use client';

import { useState } from 'react';
import Loader from './Loader';

export default function PageShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Loader onFinish={() => setReady(true)} />
      <div style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease' }}>{children}</div>
    </>
  );
}

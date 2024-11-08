// /src/app/page.tsx

'use client';

import { VentJar } from '@/components/VentJarJar';

export default function Home() {
  return (
    <main className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
      <VentJar />
    </main>
  );
}
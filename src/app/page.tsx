// /src/app/page.tsx

'use client';

import { VentJar } from '@/components/VentJarJar';

export default function Home() {
  return (
    <main className="min-h-screen p-4 flex items-start justify-center bg-gray-50">
      <div className="mt-12 w-full max-w-md">
        <VentJar />
      </div>
    </main>
  );
}
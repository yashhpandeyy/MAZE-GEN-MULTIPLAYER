import { MazeGeneratorClient } from '@/components/maze-generator-client';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)] dark:bg-grid-slate-700/40"></div>
      </div>
      <main className="relative z-10 flex w-full flex-col items-center p-4 sm:p-8">
        <MazeGeneratorClient />
      </main>
    </div>
  );
}

import { MazeGeneratorClient } from '@/components/maze-generator-client';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
      </div>
      
      {/* Background Glows */}
      <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"></div>
      <div className="absolute -bottom-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]"></div>

      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-start p-4 md:p-12">
        <MazeGeneratorClient />
      </main>
    </div>
  );
}

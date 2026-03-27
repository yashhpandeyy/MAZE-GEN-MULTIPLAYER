'use client';

import { useState, useEffect, useRef } from 'react';
import { Wand2, Download, Minus, Plus, Timer, Swords, Layers, Settings2 } from 'lucide-react';
import { generateMaze, type Cell } from '@/lib/maze-generator';
import { MazeDisplay } from '@/components/maze-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { LogoIcon } from './icons/logo';

export function MazeGeneratorClient() {
  // Maze Settings
  const [width, setWidth] = useState(24);
  const [height, setHeight] = useState(24);
  const [maze, setMaze] = useState<Cell[][] | null>(null);
  const [generationKey, setGenerationKey] = useState(0);
  
  // Game Settings
  const [bombTimer, setBombTimer] = useState(45);
  const [roundDuration, setRoundDuration] = useState(120);
  const [totalRounds, setTotalRounds] = useState(5);

  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (width < 4 || height < 4 || width > 40 || height > 40 || width % 2 !== 0 || height % 2 !== 0) {
      toast({
        title: 'Invalid Dimensions',
        description: 'Please choose even width and height between 4 and 40.',
        variant: 'destructive',
      });
      return;
    }
    const newMaze = generateMaze(width, height);
    setMaze(newMaze);
    setGenerationKey((prev) => prev + 1);
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    const svgNode = svgRef.current;
    if (!svgNode || !svgNode.parentElement) return;

    try {
      const clonedSvgNode = svgNode.cloneNode(true) as SVGSVGElement;
      const svgData = new XMLSerializer().serializeToString(clonedSvgNode);
      const canvas = document.createElement('canvas');
      const svgSize = svgNode.viewBox.baseVal;
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        ctx.fillStyle = '#020617'; // slate-950
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `maze-config-${width}x${height}.png`;
        link.click();
      };
      img.src = url;
    } catch (e) {
      toast({ title: 'Download Failed', variant: 'destructive' });
    }
  };

  const updateDimension = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    const clampedValue = Math.max(4, Math.min(40, value));
    setter(clampedValue);
  };

  return (
    <div className="w-full max-w-7xl">
      {/* Header */}
      <div className="mb-12 flex items-center gap-4">
        <div className="rounded-xl bg-primary/20 p-3 ring-1 ring-primary/40 backdrop-blur-md">
          <LogoIcon className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-white uppercase">
            Procedural Maze Gen
          </h1>
          <p className="text-sm font-medium tracking-widest text-primary/60 uppercase">
            Match Configuration System v2.0
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <h2 className="font-headline text-xl font-bold text-white uppercase tracking-tight">Map Geometry</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white/70 uppercase text-xs font-bold tracking-widest">Grid Width</Label>
                  <span className="text-primary font-mono font-bold">{width}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white" onClick={() => updateDimension(setWidth, width - 2)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Slider 
                    value={[width]} 
                    min={4} 
                    max={40} 
                    step={2} 
                    onValueChange={([v]) => updateDimension(setWidth, v)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white" onClick={() => updateDimension(setWidth, width + 2)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white/70 uppercase text-xs font-bold tracking-widest">Grid Height</Label>
                  <span className="text-primary font-mono font-bold">{height}px</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white" onClick={() => updateDimension(setHeight, height - 2)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Slider 
                    value={[height]} 
                    min={4} 
                    max={40} 
                    step={2} 
                    onValueChange={([v]) => updateDimension(setHeight, v)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white/5 border-white/10 text-white" onClick={() => updateDimension(setHeight, height + 2)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Button onClick={handleGenerate} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 uppercase tracking-tighter shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Map
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-2">
              <Swords className="h-5 w-5 text-accent" />
              <h2 className="font-headline text-xl font-bold text-white uppercase tracking-tight">Match Rules</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/50 uppercase text-[10px] font-bold tracking-widest">Bomb Timer (s)</Label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                    <Input 
                      type="number" 
                      value={bombTimer} 
                      onChange={(e) => setBombTimer(parseInt(e.target.value))}
                      className="bg-white/5 border-white/10 pl-10 text-white font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/50 uppercase text-[10px] font-bold tracking-widest">Total Rounds</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                    <Input 
                      type="number" 
                      value={totalRounds} 
                      onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                      className="bg-white/5 border-white/10 pl-10 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white/70 uppercase text-xs font-bold tracking-widest">Round Duration</Label>
                  <span className="text-accent font-mono font-bold">{roundDuration}s</span>
                </div>
                <Slider 
                  value={[roundDuration]} 
                  min={30} 
                  max={300} 
                  step={10} 
                  onValueChange={([v]) => setRoundDuration(v)}
                />
              </div>
            </div>
          </section>

          <Button onClick={handleDownload} variant="ghost" className="w-full text-white/50 hover:text-white hover:bg-white/10">
            <Download className="mr-2 h-4 w-4" />
            Export Config
          </Button>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative flex-1 rounded-2xl border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[500px]">
            {/* Viewport Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Live Preview</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {maze && (
                <div className="w-full h-full max-w-full max-h-full">
                  <MazeDisplay key={generationKey} ref={svgRef} maze={maze} cellSize={25} />
                </div>
              )}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-primary/40"></div>
            <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-primary/40"></div>
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-primary/40"></div>
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary/40"></div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex gap-8">
              <div>
                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Difficulty</span>
                <span className="text-sm text-white font-mono uppercase tracking-tighter">Class {Math.floor((width + height) / 10)}</span>
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/10" />
              <div>
                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Symmetry</span>
                <span className="text-sm text-primary font-mono uppercase tracking-tighter">Perfect 4-Way</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Status</span>
              <span className="text-sm text-green-400 font-mono uppercase tracking-tighter italic">Ready to deploy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

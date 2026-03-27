'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Wand2, Download, Minus, Plus, Timer, Swords, Layers, Settings2, Play, Pause, FastForward } from 'lucide-react';
import { initializeQuadrant, mirrorQuadrant, getUnvisitedNeighbors, removeWall, type Cell } from '@/lib/maze-generator';
import { MazeDisplay } from '@/components/maze-display';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { LogoIcon } from './icons/logo';

export function MazeGeneratorClient() {
  // Maze Settings
  const [width, setWidth] = useState(24);
  const [height, setHeight] = useState(24);
  const [maze, setMaze] = useState<Cell[][] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [generationSpeed, setGenerationSpeed] = useState(20); // Delay in ms
  
  // Internal Generation State
  const [activeHeads, setActiveHeads] = useState<Set<string>>(new Set());
  const generationRef = useRef<NodeJS.Timeout | null>(null);

  // Game Settings
  const [bombTimer, setBombTimer] = useState(45);
  const [roundDuration, setRoundDuration] = useState(120);
  const [totalRounds, setTotalRounds] = useState(5);

  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const stopGeneration = useCallback(() => {
    if (generationRef.current) {
      clearTimeout(generationRef.current);
      generationRef.current = null;
    }
    setIsGenerating(false);
  }, []);

  const handleGenerate = useCallback(() => {
    stopGeneration();

    if (width % 2 !== 0 || height % 2 !== 0) {
      toast({ title: 'Even dimensions required', variant: 'destructive' });
      return;
    }

    const quadWidth = width / 2;
    const quadHeight = height / 2;
    const quadrant = initializeQuadrant(quadWidth, quadHeight);

    if (!animate) {
      // Instant Generation
      const stack: Cell[] = [];
      let current = quadrant[0][0];
      current.visited = true;
      stack.push(current);

      while (stack.length > 0) {
        current = stack.pop()!;
        const neighbors = getUnvisitedNeighbors(current, quadrant);
        if (neighbors.length > 0) {
          stack.push(current);
          const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
          removeWall(current, neighbor);
          neighbor.visited = true;
          stack.push(neighbor);
        }
      }
      quadrant[quadHeight - 1][quadWidth - 1].right = false;
      quadrant[quadHeight - 1][quadWidth - 1].bottom = false;
      setMaze(mirrorQuadrant(quadrant, width, height));
      return;
    }

    // Animated Generation
    setIsGenerating(true);
    const stack: Cell[] = [];
    let current = quadrant[0][0];
    current.visited = true;
    stack.push(current);

    const step = () => {
      if (stack.length === 0) {
        // Finishing Touches
        quadrant[quadHeight - 1][quadWidth - 1].right = false;
        quadrant[quadHeight - 1][quadWidth - 1].bottom = false;
        setMaze(mirrorQuadrant(quadrant, width, height));
        setActiveHeads(new Set());
        setIsGenerating(false);
        return;
      }

      current = stack.pop()!;
      const neighbors = getUnvisitedNeighbors(current, quadrant);

      if (neighbors.length > 0) {
        stack.push(current);
        const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(current, neighbor);
        neighbor.visited = true;
        stack.push(neighbor);
        
        // Update Heads for visuals (Mirrored)
        const newHeads = new Set<string>();
        const hx = neighbor.x;
        const hy = neighbor.y;
        newHeads.add(`${hx}-${hy}`);
        newHeads.add(`${width - 1 - hx}-${hy}`);
        newHeads.add(`${hx}-${height - 1 - hy}`);
        newHeads.add(`${width - 1 - hx}-${height - 1 - hy}`);
        setActiveHeads(newHeads);
      }

      setMaze(mirrorQuadrant(quadrant, width, height));
      generationRef.current = setTimeout(step, 101 - generationSpeed);
    };

    step();
  }, [width, height, animate, generationSpeed, stopGeneration, toast]);

  useEffect(() => {
    handleGenerate();
    return () => stopGeneration();
  }, []); // Initial load only

  const handleDownload = () => {
    const svgNode = svgRef.current;
    if (!svgNode) return;
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
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `maze-${width}x${height}.png`;
        link.click();
      };
      img.src = url;
    } catch (e) {
      toast({ title: 'Export failed', variant: 'destructive' });
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
            Map Forge v3.0 // Animated Engine
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Settings */}
        <div className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <h2 className="font-headline text-xl font-bold text-white uppercase tracking-tight">Core Config</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-white/70 uppercase text-xs font-bold">Animation Mode</Label>
                  <p className="text-[10px] text-white/40">Watch the algorithm carve paths</p>
                </div>
                <Switch checked={animate} onCheckedChange={setAnimate} />
              </div>

              {animate && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-white/50 uppercase text-[10px] font-bold">Engine Speed</Label>
                    <FastForward className="h-3 w-3 text-primary/60" />
                  </div>
                  <Slider value={[generationSpeed]} min={1} max={100} onValueChange={([v]) => setGenerationSpeed(v)} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/50 uppercase text-[10px] font-bold">Width ({width})</Label>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" className="h-7 w-7 bg-white/5 border-white/10" onClick={() => updateDimension(setWidth, width - 2)} disabled={isGenerating}>
                        <Minus className="h-3 w-3" />
                     </Button>
                     <Button variant="outline" size="icon" className="h-7 w-7 bg-white/5 border-white/10" onClick={() => updateDimension(setWidth, width + 2)} disabled={isGenerating}>
                        <Plus className="h-3 w-3" />
                     </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/50 uppercase text-[10px] font-bold">Height ({height})</Label>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" className="h-7 w-7 bg-white/5 border-white/10" onClick={() => updateDimension(setHeight, height - 2)} disabled={isGenerating}>
                        <Minus className="h-3 w-3" />
                     </Button>
                     <Button variant="outline" size="icon" className="h-7 w-7 bg-white/5 border-white/10" onClick={() => updateDimension(setHeight, height + 2)} disabled={isGenerating}>
                        <Plus className="h-3 w-3" />
                     </Button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={isGenerating ? stopGeneration : handleGenerate} 
                className={`w-full font-bold h-12 uppercase tracking-tighter shadow-lg transition-all ${isGenerating ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
              >
                {isGenerating ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isGenerating ? 'Abort Process' : 'Forge Labyrinth'}
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
                    <input 
                      type="number" 
                      value={bombTimer} 
                      onChange={(e) => setBombTimer(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/50 uppercase text-[10px] font-bold tracking-widest">Total Rounds</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                    <input 
                      type="number" 
                      value={totalRounds} 
                      onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-10 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-white/70 uppercase text-xs font-bold tracking-widest">Round Duration</Label>
                  <span className="text-accent font-mono font-bold">{roundDuration}s</span>
                </div>
                <Slider value={[roundDuration]} min={30} max={300} step={10} onValueChange={([v]) => setRoundDuration(v)} />
              </div>
            </div>
          </section>

          <Button onClick={handleDownload} variant="ghost" className="w-full text-white/50 hover:text-white hover:bg-white/10" disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            Export Blueprint
          </Button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="relative flex-1 rounded-2xl border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-sm overflow-hidden min-h-[550px]">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                {isGenerating ? 'Synthesizing...' : 'Tactical Display'}
              </span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {maze && (
                <div className="w-full h-full max-w-full max-h-full">
                  <MazeDisplay maze={maze} cellSize={20} activeCells={activeHeads} />
                </div>
              )}
            </div>

            {/* Accents */}
            <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-primary/40"></div>
            <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-primary/40"></div>
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-primary/40"></div>
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-primary/40"></div>
          </div>
          
          <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex gap-8">
              <div>
                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Complex</span>
                <span className="text-sm text-white font-mono uppercase">Level {Math.floor((width + height) / 5)}</span>
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/10" />
              <div>
                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Symmetry</span>
                <span className="text-sm text-primary font-mono uppercase">Quad-Reflect</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest">Engine Status</span>
              <span className={`text-sm font-mono uppercase italic ${isGenerating ? 'text-amber-400' : 'text-green-400'}`}>
                {isGenerating ? 'Compiling paths' : 'Link Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

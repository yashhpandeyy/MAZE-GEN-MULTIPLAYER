'use client';

import { useState, useEffect, useRef } from 'react';
import { Wand2, Download, Minus, Plus } from 'lucide-react';
import { generateMaze, type Cell } from '@/lib/maze-generator';
import { MazeDisplay } from '@/components/maze-display';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogoIcon } from './icons/logo';

export function MazeGeneratorClient() {
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(12);
  const [maze, setMaze] = useState<Cell[][] | null>(null);
  const [generationKey, setGenerationKey] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (width < 3 || height < 3 || width > 41 || height > 41) {
      toast({
        title: 'Invalid Dimensions',
        description: 'Please choose width and height between 3 and 41.',
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
  }, []);

  const handleDownload = () => {
    const svgNode = svgRef.current;
    if (!svgNode) {
      toast({
        title: 'Error',
        description: 'Could not find the maze SVG to download.',
        variant: 'destructive',
      });
      return;
    }

    try {
      svgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const svgData = svgNode.outerHTML;
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `labyrinth-forge-maze-${width}x${height}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'An unexpected error occurred while preparing your download.',
        variant: 'destructive',
      });
    }
  };

  const updateDimension = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    if (value >= 3 && value <= 41) {
      setter(value);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
      <header className="text-center flex flex-col items-center gap-4">
        <LogoIcon className="w-16 h-16 text-primary" />
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Labyrinth Forge
        </h1>
        <p className="mt-2 font-body text-lg text-muted-foreground max-w-2xl">
          Craft intricate mazes with a single click. Adjust the grid size and let our procedural algorithm forge a unique challenge every time.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Customize Your Maze</CardTitle>
              <CardDescription>
                Define the dimensions of your labyrinth.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="width" className="font-medium">Width</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setWidth, width - 1)} disabled={width <= 3}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input id="width" type="number" value={width} onChange={(e) => updateDimension(setWidth, parseInt(e.target.value) || 0)} className="text-center" min="3" max="41" />
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setWidth, width + 1)} disabled={width >= 41}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="font-medium">Height</Label>
                 <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setHeight, height - 1)} disabled={height <= 3}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input id="height" type="number" value={height} onChange={(e) => updateDimension(setHeight, parseInt(e.target.value) || 0)} className="text-center" min="3" max="41"/>
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setHeight, height + 1)} disabled={height >= 41}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleGenerate} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Wand2 />
                Generate New Maze
              </Button>
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download />
                Download SVG
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2 min-h-[300px] lg:min-h-[500px]">
          {maze && <MazeDisplay key={generationKey} ref={svgRef} maze={maze} cellSize={25} />}
        </div>
      </div>
    </div>
  );
}

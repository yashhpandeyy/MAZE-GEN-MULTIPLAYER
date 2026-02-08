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
import { MazePossibilities } from './maze-possibilities';

export function MazeGeneratorClient() {
  const [width, setWidth] = useState(24);
  const [height, setHeight] = useState(24);
  const [maze, setMaze] = useState<Cell[][] | null>(null);
  const [generationKey, setGenerationKey] = useState(0);
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
    if (!svgNode || !svgNode.parentElement) {
      toast({
        title: 'Error',
        description: 'Could not find the maze SVG to download.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const clonedSvgNode = svgNode.cloneNode(true) as SVGSVGElement;

      // Get computed styles from original SVG and apply to clone
      const originalLinesGroup = svgNode.querySelector('g[stroke="hsl(var(--foreground))"]');
      if (originalLinesGroup) {
        const strokeColor = getComputedStyle(originalLinesGroup).stroke;
        const clonedLinesGroup = clonedSvgNode.querySelector('g[stroke="hsl(var(--foreground))"]');
        if (clonedLinesGroup) {
          clonedLinesGroup.setAttribute('stroke', strokeColor);
        }
      }

      const originalCornerRects = svgNode.querySelectorAll('rect[fill="hsl(var(--chart-2))"]');
      if (originalCornerRects.length > 0) {
        const fillColor = getComputedStyle(originalCornerRects[0]).fill;
        const clonedCornerRects = clonedSvgNode.querySelectorAll('rect[fill="hsl(var(--chart-2))"]');
        clonedCornerRects.forEach((rect) => {
          rect.setAttribute('fill', fillColor);
        });
      }

      const originalCenterRects = svgNode.querySelectorAll('rect[fill="hsl(var(--destructive))"]');
      if (originalCenterRects.length > 0) {
        const fillColor = getComputedStyle(originalCenterRects[0]).fill;
        const clonedCenterRects = clonedSvgNode.querySelectorAll('rect[fill="hsl(var(--destructive))"]');
        clonedCenterRects.forEach(rect => {
          rect.setAttribute('fill', fillColor);
        })
      }

      const svgData = new XMLSerializer().serializeToString(clonedSvgNode);
      const canvas = document.createElement('canvas');

      const svgSize = svgNode.viewBox.baseVal;
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast({
          title: 'Download Failed',
          description: 'Could not create canvas context to generate PNG.',
          variant: 'destructive',
        });
        return;
      }

      const parentStyle = window.getComputedStyle(svgNode.parentElement);
      const backgroundColor = parentStyle.backgroundColor;

      const img = new Image();
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `procedural-maze-gen-${width}x${height}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        toast({
          title: 'Download Failed',
          description: 'Could not load SVG image to convert to PNG.',
          variant: 'destructive',
        });
      };

      img.src = url;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while preparing your download.';
      toast({
        title: 'Download Failed',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const updateDimension = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    if (isNaN(value)) {
      setter(4);
      return;
    }
    const clampedValue = Math.max(4, Math.min(40, value));
    setter(clampedValue);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
      <header className="text-center flex flex-col items-center gap-4">
        <LogoIcon className="w-16 h-16 text-primary" />
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Procedural Maze Gen
        </h1>
        <MazePossibilities width={width} height={height} />
        <p className="mt-2 font-body text-lg text-muted-foreground max-w-3xl">
          This tool procedurally generates mazes using a unique, custom-developed algorithm. It forges a labyrinth by first creating a perfect maze in a single quadrant, then applying a four-way symmetrical mirroring with custom wall-swapping logic. This guarantees the path from each of the four corners to the center is perfectly balanced.
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
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setWidth, width - 2)} disabled={width <= 4}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input id="width" type="number" value={width} onChange={(e) => updateDimension(setWidth, parseInt(e.target.value))} className="text-center" min="4" max="40" />
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setWidth, width + 2)} disabled={width >= 40}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="font-medium">Height</Label>
                 <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setHeight, height - 2)} disabled={height <= 4}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input id="height" type="number" value={height} onChange={(e) => updateDimension(setHeight, parseInt(e.target.value))} className="text-center" min="4" max="40"/>
                  <Button variant="outline" size="icon" onClick={() => updateDimension(setHeight, height + 2)} disabled={height >= 40}>
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
                Download PNG
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

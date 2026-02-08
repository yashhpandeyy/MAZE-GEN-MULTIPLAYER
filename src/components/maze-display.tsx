import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { Cell } from '@/lib/maze-generator';

interface MazeDisplayProps {
  maze: Cell[][];
  cellSize: number;
}

const MazeDisplay = forwardRef(
  ({ maze, cellSize }: MazeDisplayProps, ref: ForwardedRef<SVGSVGElement>) => {
    if (!maze || maze.length === 0 || maze[0].length === 0) {
      return null;
    }

    const height = maze.length;
    const width = maze[0].length;

    const svgWidth = width * cellSize;
    const svgHeight = height * cellSize;

    return (
      <div className="flex justify-center items-center w-full h-full p-4 bg-card rounded-lg shadow-lg animate-fade-in">
        <svg
          ref={ref}
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="max-w-full max-h-full"
        >
          <g stroke="hsl(var(--foreground))" strokeWidth={2} strokeLinecap="round">
            {maze.map((row, y) =>
              row.map((cell, x) => {
                const lines = [];
                const x1 = x * cellSize;
                const y1 = y * cellSize;
                const x2 = (x + 1) * cellSize;
                const y2 = (y + 1) * cellSize;

                if (cell.top) {
                  lines.push(<line key={`top-${x}-${y}`} x1={x1} y1={y1} x2={x2} y2={y1} />);
                }
                if (cell.right) {
                  lines.push(<line key={`right-${x}-${y}`} x1={x2} y1={y1} x2={x2} y2={y2} />);
                }
                if (cell.bottom) {
                  lines.push(<line key={`bottom-${x}-${y}`} x1={x1} y1={y2} x2={x2} y2={y2} />);
                }
                if (cell.left) {
                  lines.push(<line key={`left-${x}-${y}`} x1={x1} y1={y1} x2={x1} y2={y2} />);
                }
                return lines;
              })
            )}
          </g>
        </svg>
      </div>
    );
  }
);

MazeDisplay.displayName = 'MazeDisplay';

export { MazeDisplay };

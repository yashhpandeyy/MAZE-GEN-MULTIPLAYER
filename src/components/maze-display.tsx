import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { Cell } from '@/lib/maze-generator';

interface MazeDisplayProps {
  maze: Cell[][];
  cellSize: number;
  activeCells?: Set<string>; // For animation highlighting
}

const MazeDisplay = forwardRef(
  ({ maze, cellSize, activeCells }: MazeDisplayProps, ref: ForwardedRef<SVGSVGElement>) => {
    if (!maze || maze.length === 0 || maze[0].length === 0) {
      return null;
    }

    const height = maze.length;
    const width = maze[0].length;
    const svgWidth = width * cellSize;
    const svgHeight = height * cellSize;

    return (
      <div className="flex justify-center items-center w-full h-full overflow-hidden">
        <svg
          ref={ref}
          width="100%"
          height="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="max-w-full max-h-full transition-all duration-300 ease-out"
        >
          {/* Grid Background */}
          <rect width={svgWidth} height={svgHeight} fill="rgba(0,0,0,0.4)" />
          
          <g>
            {maze.map((row, y) =>
              row.map((cell, x) => {
                const cellId = `${x}-${y}`;
                const isActive = activeCells?.has(cellId);
                const isVisited = cell.visited;

                // Player Starts
                const isPlayer1Start = x === 0 && y === 0;
                const isPlayer2Start = x === width - 1 && y === 0;
                const isPlayer3Start = x === 0 && y === height - 1;
                const isPlayer4Start = x === width - 1 && y === height - 1;

                // Center Exit
                const isCenterCell =
                  (x === width / 2 - 1 || x === width / 2) &&
                  (y === height / 2 - 1 || y === height / 2);

                if (isPlayer1Start || isPlayer2Start || isPlayer3Start || isPlayer4Start) {
                  return (
                    <rect
                      key={`corner-${x}-${y}`}
                      x={x * cellSize}
                      y={y * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="hsl(var(--primary))"
                      className="opacity-60"
                    />
                  );
                }

                if (isCenterCell) {
                  return (
                    <rect
                      key={`center-${x}-${y}`}
                      x={x * cellSize}
                      y={y * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="hsl(var(--destructive))"
                      className={isVisited ? "animate-pulse" : "opacity-20"}
                    />
                  );
                }

                // Active Head Visualization
                if (isActive) {
                  return (
                    <rect
                      key={`active-${x}-${y}`}
                      x={x * cellSize}
                      y={y * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="hsl(var(--accent))"
                      className="animate-pulse"
                    />
                  );
                }

                // Carved/Visited Path Visual
                if (isVisited) {
                  return (
                    <rect
                      key={`visited-${x}-${y}`}
                      x={x * cellSize}
                      y={y * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="rgba(255,255,255,0.05)"
                    />
                  );
                }
                
                return null;
              })
            )}
          </g>
          
          <g stroke="white" strokeWidth={1.5} strokeLinecap="square" className="opacity-90">
            {maze.map((row, y) =>
              row.map((cell, x) => {
                const lines = [];
                const x1 = x * cellSize;
                const y1 = y * cellSize;
                const x2 = (x + 1) * cellSize;
                const y2 = (y + 1) * cellSize;

                if (cell.top) lines.push(<line key={`top-${x}-${y}`} x1={x1} y1={y1} x2={x2} y2={y1} />);
                if (cell.right) lines.push(<line key={`right-${x}-${y}`} x1={x2} y1={y1} x2={x2} y2={y2} />);
                if (cell.bottom) lines.push(<line key={`bottom-${x}-${y}`} x1={x1} y1={y2} x2={x2} y2={y2} />);
                if (cell.left) lines.push(<line key={`left-${x}-${y}`} x1={x1} y1={y1} x2={x1} y2={y2} />);
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

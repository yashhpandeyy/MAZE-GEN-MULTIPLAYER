export interface Cell {
  x: number;
  y: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

/**
 * Initializes a quadrant grid for generation.
 */
export function initializeQuadrant(width: number, height: number): Cell[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  );
}

/**
 * Mirrors a quadrant into a full maze grid with 4-way symmetry.
 */
export function mirrorQuadrant(quadrant: Cell[][], fullWidth: number, fullHeight: number): Cell[][] {
  const quadHeight = quadrant.length;
  const quadWidth = quadrant[0].length;
  
  const fullMaze: Cell[][] = Array.from({ length: fullHeight }, (_, y) =>
    Array.from({ length: fullWidth }, (_, x) => ({
      x,
      y,
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  );

  for (let y = 0; y < quadHeight; y++) {
    for (let x = 0; x < quadWidth; x++) {
      const sourceCell = quadrant[y][x];

      // Top-Left (original)
      fullMaze[y][x] = { ...sourceCell, x, y };

      // Top-Right (Horizontal Mirror)
      const trX = fullWidth - 1 - x;
      fullMaze[y][trX] = {
        x: trX,
        y: y,
        top: sourceCell.top,
        bottom: sourceCell.bottom,
        left: sourceCell.right,
        right: sourceCell.left,
        visited: sourceCell.visited,
      };

      // Bottom-Left (Vertical Mirror)
      const blY = fullHeight - 1 - y;
      fullMaze[blY][x] = {
        x,
        y: blY,
        top: sourceCell.bottom,
        bottom: sourceCell.top,
        left: sourceCell.left,
        right: sourceCell.right,
        visited: sourceCell.visited,
      };

      // Bottom-Right (Horizontal & Vertical Mirror)
      const brX = fullWidth - 1 - x;
      const brY = fullHeight - 1 - y;
      fullMaze[brY][brX] = {
        x: brX,
        y: brY,
        top: sourceCell.bottom,
        bottom: sourceCell.top,
        left: sourceCell.right,
        right: sourceCell.left,
        visited: sourceCell.visited,
      };
    }
  }

  // Final touches: ensure the center path is open if the quadrant corner is open
  if (!quadrant[quadHeight - 1][quadWidth - 1].right) {
     const cx1 = quadWidth - 1;
     const cx2 = quadWidth;
     const cy = quadHeight - 1;
     fullMaze[cy][cx1].right = false;
     fullMaze[cy][cx2].left = false;
     // Mirror bottom row
     fullMaze[fullHeight - 1 - cy][cx1].right = false;
     fullMaze[fullHeight - 1 - cy][cx2].left = false;
  }
  if (!quadrant[quadHeight - 1][quadWidth - 1].bottom) {
    const cy1 = quadHeight - 1;
    const cy2 = quadHeight;
    const cx = quadWidth - 1;
    fullMaze[cy1][cx].bottom = false;
    fullMaze[cy2][cx].top = false;
    // Mirror right side
    fullMaze[cy1][fullWidth - 1 - cx].bottom = false;
    fullMaze[cy2][fullWidth - 1 - cx].top = false;
  }

  return fullMaze;
}

/**
 * Standard synchronous generation (Legacy support)
 */
export function generateMaze(width: number, height: number): Cell[][] {
  const quadWidth = width / 2;
  const quadHeight = height / 2;
  const quadrant = initializeQuadrant(quadWidth, quadHeight);

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

  return mirrorQuadrant(quadrant, width, height);
}

export function getUnvisitedNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;
  const height = grid.length;
  const width = grid[0].length;

  if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x]);
  if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1]);
  if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x]);
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1]);

  return neighbors;
}

export function removeWall(a: Cell, b: Cell) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  if (x === 1) { a.left = false; b.right = false; }
  else if (x === -1) { a.right = false; b.left = false; }
  if (y === 1) { a.top = false; b.bottom = false; }
  else if (y === -1) { a.bottom = false; b.top = false; }
}

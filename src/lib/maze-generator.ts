export interface Cell {
  x: number;
  y: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

// Generates a maze only in the top-left quadrant of the grid.
export function generateMaze(width: number, height: number): Cell[][] {
  // 1. Initialize the full grid with all walls present.
  const fullMaze: Cell[][] = Array.from({ length: height }, (_, y) =>
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

  // 2. Define the dimensions of the top-left quadrant.
  const quadWidth = Math.ceil(width / 2);
  const quadHeight = Math.ceil(height / 2);

  // 3. Run Randomized DFS only on the top-left quadrant.
  const stack: Cell[] = [];
  let current = fullMaze[0][0];
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack.pop()!;
    const neighbors = getUnvisitedNeighbors(current, fullMaze, quadWidth, quadHeight);

    if (neighbors.length > 0) {
      stack.push(current);
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, neighbor);
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }

  // 4. Return the full maze with only the top-left quadrant carved out.
  return fullMaze;
}

// Helper to get unvisited neighbors within the quadrant boundaries
function getUnvisitedNeighbors(cell: Cell, grid: Cell[][], quadWidth: number, quadHeight: number): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;

  // Top
  if (y > 0 && !grid[y - 1][x].visited) {
    neighbors.push(grid[y - 1][x]);
  }
  // Right (check against quadWidth)
  if (x < quadWidth - 1 && !grid[y][x + 1].visited) {
    neighbors.push(grid[y][x + 1]);
  }
  // Bottom (check against quadHeight)
  if (y < quadHeight - 1 && !grid[y + 1][x].visited) {
    neighbors.push(grid[y + 1][x]);
  }
  // Left
  if (x > 0 && !grid[y][x - 1].visited) {
    neighbors.push(grid[y][x - 1]);
  }

  return neighbors;
}

// Helper to remove walls between two cells
function removeWall(a: Cell, b: Cell) {
  const x = a.x - b.x;
  const y = a.y - b.y;

  if (x === 1) { // a is to the right of b
    a.left = false;
    b.right = false;
  } else if (x === -1) { // a is to the left of b
    a.right = false;
    b.left = false;
  }

  if (y === 1) { // a is below b
    a.top = false;
    b.bottom = false;
  } else if (y === -1) { // a is above b
    a.bottom = false;
    b.top = false;
  }
}

export interface Cell {
  x: number;
  y: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

// Generates a maze with 4-way rotational symmetry.
export function generateMaze(width: number, height: number): Cell[][] {
  const quadWidth = width / 2;
  const quadHeight = height / 2;

  // 1. Create a temporary grid for one quadrant.
  const quadrant: Cell[][] = Array.from({ length: quadHeight }, (_, y) =>
    Array.from({ length: quadWidth }, (_, x) => ({
      x,
      y,
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    }))
  );

  // 2. Run Randomized DFS on the quadrant.
  const stack: Cell[] = [];
  let current = quadrant[0][0];
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack.pop()!;
    // Note: getUnvisitedNeighbors now works on the smaller quadrant grid
    const neighbors = getUnvisitedNeighbors(current, quadrant);

    if (neighbors.length > 0) {
      stack.push(current);
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, neighbor);
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }

  // 3. Force a path to the center from the corner of the quadrant.
  // This will be mirrored to all 4 quadrants, creating a center opening.
  quadrant[quadHeight - 1][quadWidth - 1].right = false;
  quadrant[quadHeight - 1][quadWidth - 1].bottom = false;


  // 4. Initialize the full grid.
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

  // 5. Mirror the generated quadrant into all four quadrants of the full maze.
  for (let y = 0; y < quadHeight; y++) {
    for (let x = 0; x < quadWidth; x++) {
      const sourceCell = quadrant[y][x];

      // Top-Left (original)
      const tlX = x;
      const tlY = y;
      fullMaze[tlY][tlX] = { ...sourceCell, x: tlX, y: tlY };

      // Top-Right (Horizontal Mirror)
      const trX = width - 1 - x;
      const trY = y;
      fullMaze[trY][trX] = {
        x: trX,
        y: trY,
        top: sourceCell.top,
        bottom: sourceCell.bottom,
        left: sourceCell.right, // Swap
        right: sourceCell.left, // Swap
        visited: sourceCell.visited,
      };

      // Bottom-Left (Vertical Mirror)
      const blX = x;
      const blY = height - 1 - y;
      fullMaze[blY][blX] = {
        x: blX,
        y: blY,
        top: sourceCell.bottom, // Swap
        bottom: sourceCell.top, // Swap
        left: sourceCell.left,
        right: sourceCell.right,
        visited: sourceCell.visited,
      };

      // Bottom-Right (Horizontal & Vertical Mirror)
      const brX = width - 1 - x;
      const brY = height - 1 - y;
      fullMaze[brY][brX] = {
        x: brX,
        y: brY,
        top: sourceCell.bottom, // Vertical Swap
        bottom: sourceCell.top, // Vertical Swap
        left: sourceCell.right, // Horizontal Swap
        right: sourceCell.left, // Horizontal Swap
        visited: sourceCell.visited,
      };
    }
  }
  
  return fullMaze;
}

// Helper to get unvisited neighbors within a grid
function getUnvisitedNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;
  const height = grid.length;
  const width = grid[0].length;

  // Top
  if (y > 0 && !grid[y - 1][x].visited) {
    neighbors.push(grid[y - 1][x]);
  }
  // Right
  if (x < width - 1 && !grid[y][x + 1].visited) {
    neighbors.push(grid[y][x + 1]);
  }
  // Bottom
  if (y < height - 1 && !grid[y + 1][x].visited) {
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

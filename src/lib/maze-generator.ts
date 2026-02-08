export interface Cell {
  x: number;
  y: number;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

// The new main function, which creates a symmetrical maze for 4 players
export function generateMaze(width: number, height: number): Cell[][] {
  const quadWidth = Math.ceil(width / 2);
  const quadHeight = Math.ceil(height / 2);

  // 1. Generate a standard maze for the top-left quadrant
  const quadrant = generateQuadrantMaze(quadWidth, quadHeight);

  // 2. Create the full grid by mirroring the quadrant
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

  for (let y = 0; y < quadHeight; y++) {
    for (let x = 0; x < quadWidth; x++) {
      const sourceCell = quadrant[y][x];
      const targetX = width - 1 - x;
      const targetY = height - 1 - y;

      // Top-left (original)
      let cellTL = fullMaze[y][x];
      cellTL.top = sourceCell.top;
      cellTL.right = sourceCell.right;
      cellTL.bottom = sourceCell.bottom;
      cellTL.left = sourceCell.left;
      cellTL.visited = sourceCell.visited;

      // Top-right (mirrored horizontally)
      let cellTR = fullMaze[y][targetX];
      cellTR.top = sourceCell.top;
      cellTR.right = sourceCell.left;
      cellTR.bottom = sourceCell.bottom;
      cellTR.left = sourceCell.right;
      cellTR.visited = sourceCell.visited;
      
      // Bottom-left (mirrored vertically)
      let cellBL = fullMaze[targetY][x];
      cellBL.top = sourceCell.bottom;
      cellBL.right = sourceCell.right;
      cellBL.bottom = sourceCell.top;
      cellBL.left = sourceCell.left;
      cellBL.visited = sourceCell.visited;

      // Bottom-right (mirrored horizontally and vertically)
      let cellBR = fullMaze[targetY][targetX];
      cellBR.top = sourceCell.bottom;
      cellBR.right = sourceCell.left;
      cellBR.bottom = sourceCell.top;
      cellBR.left = sourceCell.right;
      cellBR.visited = sourceCell.visited;
    }
  }

  // 3. Connect the quadrants symmetrically through the center.
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  // Remove walls around the center cell to make it an accessible meeting point.
  // This ensures a fair path for all four players to the exit.
  
  // Top neighbor
  if (centerY > 0) fullMaze[centerY - 1][centerX].bottom = false;
  fullMaze[centerY][centerX].top = false;

  // Bottom neighbor
  if (centerY < height - 1) fullMaze[centerY + 1][centerX].top = false;
  fullMaze[centerY][centerX].bottom = false;

  // Left neighbor
  if (centerX > 0) fullMaze[centerY][centerX - 1].right = false;
  fullMaze[centerY][centerX].left = false;
  
  // Right neighbor
  if (centerX < width - 1) fullMaze[centerY][centerX + 1].left = false;
  fullMaze[centerY][centerX].right = false;

  return fullMaze;
}


// Generates a maze for a single quadrant using randomized DFS
function generateQuadrantMaze(width: number, height: number): Cell[][] {
  const grid: Cell[][] = Array.from({ length: height }, (_, y) =>
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

  const stack: Cell[] = [];
  // Start from top-left corner (player 1's starting point for the quadrant)
  let current = grid[0][0];
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack.pop()!;
    const neighbors = getUnvisitedNeighbors(current, grid, width, height);

    if (neighbors.length > 0) {
      stack.push(current);
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, neighbor);
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }

  return grid;
}

function getUnvisitedNeighbors(cell: Cell, grid: Cell[][], width: number, height: number): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;

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

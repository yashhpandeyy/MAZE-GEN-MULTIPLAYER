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
      const xMirror = width - 1 - x;
      const yMirror = height - 1 - y;

      // Top-left (original)
      fullMaze[y][x] = { ...sourceCell };

      // Top-right (mirrored horizontally)
      fullMaze[y][xMirror] = {
        x: xMirror,
        y: y,
        visited: false,
        top: sourceCell.top,
        bottom: sourceCell.bottom,
        left: sourceCell.right,    // SWAP
        right: sourceCell.left,    // SWAP
      };
      
      // Bottom-left (mirrored vertically)
      fullMaze[yMirror][x] = {
        x: x,
        y: yMirror,
        visited: false,
        top: sourceCell.bottom,    // SWAP
        bottom: sourceCell.top,    // SWAP
        left: sourceCell.left,
        right: sourceCell.right,
      };
      
      // Bottom-right (both mirrors)
      fullMaze[yMirror][xMirror] = {
        x: xMirror,
        y: yMirror,
        visited: false,
        top: sourceCell.bottom,    // SWAP (vertical)
        bottom: sourceCell.top,    // SWAP (vertical)
        left: sourceCell.right,    // SWAP (horizontal)
        right: sourceCell.left,    // SWAP (horizontal)
      };
    }
  }

  // 3. Connect the quadrants symmetrically through the center.
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  // Remove walls around the center cell to make it an accessible meeting point.
  if (centerY > 0) fullMaze[centerY - 1][centerX].bottom = false;
  fullMaze[centerY][centerX].top = false;

  if (centerY < height - 1) fullMaze[centerY + 1][centerX].top = false;
  fullMaze[centerY][centerX].bottom = false;

  if (centerX > 0) fullMaze[centerY][centerX - 1].right = false;
  fullMaze[centerY][centerX].left = false;
  
  if (centerX < width - 1) fullMaze[centerY][centerX + 1].left = false;
  fullMaze[centerY][centerX].right = false;
  
  // After mirroring quadrants and opening center:
  ensureCornerConnectivity(fullMaze, width, height);
  
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
  // Start from top-left corner
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

function ensureCornerConnectivity(maze: Cell[][], width: number, height: number): void {
  const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
  const corners = [
    { x: 0, y: 0 },                    // Top-left
    { x: width - 1, y: 0 },            // Top-right
    { x: 0, y: height - 1 },           // Bottom-left
    { x: width - 1, y: height - 1 }    // Bottom-right
  ];

  corners.forEach(corner => {
    if (!hasPath(maze, corner, center, width, height)) {
      carveDirectPath(maze, corner, center);
    }
  });
}

function hasPath(
  maze: Cell[][], 
  start: {x: number, y: number}, 
  end: {x: number, y: number},
  width: number,
  height: number
): boolean {
  const visited = new Set<string>();
  const queue = [start];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.x},${current.y}`;
    
    if (current.x === end.x && current.y === end.y) return true;
    if (visited.has(key)) continue;
    visited.add(key);
    
    const cell = maze[current.y][current.x];
    
    // Check all 4 directions
    if (!cell.top && current.y > 0) 
      queue.push({x: current.x, y: current.y - 1});
    if (!cell.bottom && current.y < height - 1) 
      queue.push({x: current.x, y: current.y + 1});
    if (!cell.left && current.x > 0) 
      queue.push({x: current.x - 1, y: current.y});
    if (!cell.right && current.x < width - 1) 
      queue.push({x: current.x + 1, y: current.y});
  }
  
  return false;
}

function carveDirectPath(
  maze: Cell[][], 
  from: {x: number, y: number}, 
  to: {x: number, y: number}
): void {
  let x = from.x;
  let y = from.y;
  
  while (x !== to.x || y !== to.y) {
    if (x < to.x) {
      maze[y][x].right = false;
      maze[y][x + 1].left = false;
      x++;
    } else if (x > to.x) {
      maze[y][x].left = false;
      maze[y][x - 1].right = false;
      x--;
    } else if (y < to.y) {
      maze[y][x].bottom = false;
      maze[y + 1][x].top = false;
      y++;
    } else if (y > to.y) {
      maze[y][x].top = false;
      maze[y - 1][x].bottom = false;
      y--;
    }
  }
}

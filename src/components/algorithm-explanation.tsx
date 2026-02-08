import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AlgorithmExplanation() {
  return (
    <Card className="shadow-lg w-full max-w-7xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">How It Works: The Fair Maze Algorithm</CardTitle>
        <CardDescription>
          We use a multi-step process to generate a perfectly symmetrical maze that ensures a fair challenge for all four players.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Step 1: Generate a Single Quadrant</h3>
          <p className="text-muted-foreground mb-4">
            First, we create a small maze for the top-left quadrant using <strong>Randomized Depth-First Search (DFS)</strong>. It carves a perfect maze (no loops) by randomly exploring the grid and backtracking when it hits a dead end.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// Generates a maze for a single quadrant using randomized DFS
function generateQuadrantMaze(width, height) {
  const grid = /* ... initialize grid ... */ ;
  const stack = [];
  let current = grid[0][0]; // Start at top-left
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack.pop();
    const neighbors = getUnvisitedNeighbors(current, grid);

    if (neighbors.length > 0) {
      stack.push(current);
      // Choose a random neighbor
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Carve a path between current and neighbor
      removeWall(current, neighbor);
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }
  return grid;
}`}
            </code>
          </pre>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Step 2: Create Four-Way Symmetry by Mirroring</h3>
          <p className="text-muted-foreground mb-4">
            Once we have the top-left quadrant, we use it as a blueprint to build the other three. The key is to correctly <strong>swap</strong> the walls during mirroring to ensure paths are continuous.
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li><strong>Top-Right Quadrant:</strong> A horizontal mirror of the top-left. Left/Right walls are swapped.</li>
              <li><strong>Bottom-Left Quadrant:</strong> A vertical mirror of the top-left. Top/Bottom walls are swapped.</li>
              <li><strong>Bottom-Right Quadrant:</strong> A horizontal and vertical mirror. All walls are swapped.</li>
          </ul>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// Inside the main generateMaze function's loop
const sourceCell = quadrant[y][x];
const xMirror = width - 1 - x;
const yMirror = height - 1 - y;

// Top-left is a direct copy
fullMaze[y][x] = sourceCell;

// Top-right (horizontal mirror)
fullMaze[y][xMirror] = { 
    ...sourceCell, 
    left: sourceCell.right,  // SWAPPED
    right: sourceCell.left,  // SWAPPED
};

// Bottom-left (vertical mirror)
fullMaze[yMirror][x] = {
    ...sourceCell,
    top: sourceCell.bottom, // SWAPPED
    bottom: sourceCell.top, // SWAPPED
};

// Bottom-right (both mirrors)
fullMaze[yMirror][xMirror] = {
    ...sourceCell,
    top: sourceCell.bottom,
    bottom: sourceCell.top,
    left: sourceCell.right,
    right: sourceCell.left,
};`}
            </code>
          </pre>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Step 3: Connect the Center</h3>
          <p className="text-muted-foreground mb-4">
            The final and most crucial step is to connect the four quadrants. To ensure the exit is equally accessible, we remove all walls around the center-most cells, creating an open chamber that serves as a fair goal for everyone.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`const centerX = Math.floor(width / 2);
const centerY = Math.floor(height / 2);

// Remove walls of cells adjacent to the center, opening a path
if (centerY > 0) fullMaze[centerY - 1][centerX].bottom = false;
if (centerY < height - 1) fullMaze[centerY + 1][centerX].top = false;
if (centerX > 0) fullMaze[centerY][centerX - 1].right = false;
if (centerX < width - 1) fullMaze[centerY][centerX + 1].left = false;

// Also remove the center cell's own walls facing those neighbors
fullMaze[centerY][centerX].top = false;
fullMaze[centerY][centerX].bottom = false;
fullMaze[centerY][centerX].left = false;
fullMaze[centerY][centerX].right = false;`}
            </code>
          </pre>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Step 4: Guarantee Solvability</h3>
          <p className="text-muted-foreground mb-4">
            Symmetry is essential, but it doesn't guarantee a solvable maze. The random nature of the quadrant generation might still wall off a corner from the center. To ensure fairness, we perform a final validation step. For each corner, we use a <strong>Breadth-First Search (BFS)</strong> to check if a path to the center exists. If not, we forcibly <strong>carve a direct path</strong> to guarantee every player has a route to the goal.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// For each corner, carve a guaranteed path to center if none exists
corners.forEach(corner => {
  if (!hasPath(maze, corner, center)) {
    carveDirectPath(maze, corner, center);
  }
});

// Checks for a path using Breadth-First Search
function hasPath(maze, start, end) {
  const queue = [start];
  const visited = new Set();
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === end.x && current.y === end.y) return true;
    
    // ... add valid, unvisited neighbors to queue
  }
  return false;
}`}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

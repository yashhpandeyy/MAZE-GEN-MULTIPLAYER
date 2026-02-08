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
            Once we have the top-left quadrant, we use it as a blueprint to build the other three. This is the core of what makes the maze fair, as each player's path layout is an identical, but mirrored, challenge.
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li><strong>Top-Right Quadrant:</strong> A horizontal mirror of the top-left.</li>
              <li><strong>Bottom-Left Quadrant:</strong> A vertical mirror of the top-left.</li>
              <li><strong>Bottom-Right Quadrant:</strong> A horizontal and vertical mirror of the top-left.</li>
          </ul>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// Inside the main generateMaze function
for (let y = 0; y < quadHeight; y++) {
  for (let x = 0; x < quadWidth; x++) {
    const sourceCell = quadrant[y][x];
    const targetX = width - 1 - x;
    const targetY = height - 1 - y;

    // 1. Top-left (The original)
    // ...

    // 2. Top-right (Mirrored horizontally)
    let cellTR = fullMaze[y][targetX];
    cellTR.top = sourceCell.top;
    cellTR.right = sourceCell.left;   // Mirrored
    cellTR.bottom = sourceCell.bottom;
    cellTR.left = sourceCell.right;  // Mirrored
    
    // 3. Bottom-left (Mirrored vertically)
    // ...

    // 4. Bottom-right (Mirrored horizontally & vertically)
    // ...
  }
}`}
            </code>
          </pre>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Step 3: Connect the Center</h3>
          <p className="text-muted-foreground mb-4">
            The final and most crucial step is to connect the four quadrants. To ensure the exit is equally accessible, we remove all walls around the center-most cell, creating an open chamber that serves as a fair goal for everyone.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`const centerX = Math.floor(width / 2);
const centerY = Math.floor(height / 2);

// Remove walls around the center cell to open it up
fullMaze[centerY][centerX].top = false;
fullMaze[centerY][centerX].bottom = false;
fullMaze[centerY][centerX].left = false;
fullMaze[centerY][centerX].right = false;

// Also remove walls of adjacent cells facing the center
if (centerY > 0) fullMaze[centerY - 1][centerX].bottom = false;
if (centerY < height - 1) fullMaze[centerY + 1][centerX].top = false;
if (centerX > 0) fullMaze[centerY][centerX - 1].right = false;
if (centerX < width - 1) fullMaze[centerY][centerX + 1].left = false;`}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

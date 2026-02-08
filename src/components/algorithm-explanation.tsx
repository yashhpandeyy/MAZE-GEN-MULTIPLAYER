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
        <CardTitle className="font-headline text-3xl">How It Works: Randomized Depth-First Search</CardTitle>
        <CardDescription>
          We use a classic algorithm to generate a "perfect" maze, which means it has no loops and a single unique path between any two points.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">The Algorithm Steps</h3>
          <p className="text-muted-foreground mb-4">
            The process, also known as the "recursive backtracker" algorithm, carves a path through a grid of cells.
          </p>
          <ul className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Step 1: Choose a Starting Point.</strong> We begin at the top-left cell (the player's starting block) and mark it as "visited".</li>
              <li><strong>Step 2: Find a Neighbor.</strong> Look for any unvisited neighboring cells (top, right, bottom, or left).</li>
              <li><strong>Step 3: Carve a Path.</strong> If an unvisited neighbor is found, pick one at random, remove the wall between it and the current cell, and move to that neighbor. Mark it as visited.</li>
              <li><strong>Step 4: Backtrack When Stuck.</strong> If there are no unvisited neighbors, you've hit a dead end. Backtrack to the previous cell you visited and repeat Step 2.</li>
              <li><strong>Step 5: Finish.</strong> The maze is complete when the process has backtracked all the way to the original starting cell.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Core Logic Snippet</h3>
          <p className="text-muted-foreground mb-4">
            The core of the algorithm can be managed with a stack (an array) to handle the visiting and backtracking process.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// Generates a maze using randomized DFS
function generateMaze(width, height) {
  const grid = /* ... initialize grid with all walls ... */ ;
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
      </CardContent>
    </Card>
  );
}

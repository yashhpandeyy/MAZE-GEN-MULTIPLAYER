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
        <CardTitle className="font-headline text-3xl">How It Works: Quadrant-Based Generation</CardTitle>
        <CardDescription>
          This maze is generated using Randomized Depth-First Search, but with a twist: the algorithm only runs on the top-left quadrant of the grid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">The Algorithm Steps</h3>
          <p className="text-muted-foreground mb-4">
            We focus the path-carving process into a defined area to create a specific challenge zone.
          </p>
          <ul className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Step 1: Initialize Full Grid.</strong> A complete grid is created with all walls intact between every cell.</li>
              <li><strong>Step 2: Define Quadrant.</strong> We calculate the size of the top-left quadrant (e.g., for a 13x13 grid, we target a 7x7 area).</li>
              <li><strong>Step 3: Choose a Starting Point.</strong> We begin at the top-left cell of the quadrant (0,0) and mark it as "visited".</li>
              <li><strong>Step 4: Carve within Quadrant.</strong> Using DFS, we find unvisited neighbors *only within the quadrant's boundaries*, randomly pick one, carve a path, and move to it.</li>
              <li><strong>Step 5: Backtrack When Stuck.</strong> If a cell has no unvisited neighbors within the quadrant, we backtrack until we find a cell that does.</li>
              <li><strong>Step 6: Finish.</strong> The process ends when it has backtracked all the way to the start. The result is a maze in one corner, with the rest of the grid untouched.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Core Logic Snippet</h3>
          <p className="text-muted-foreground mb-4">
            The key is constraining the neighbor-finding logic to the quadrant's dimensions.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// Main generator function
function generateMaze(width, height) {
  const fullMaze = /* ... initialize full grid with all walls ... */ ;
  
  // Define the quadrant to work within
  const quadWidth = Math.ceil(width / 2);
  const quadHeight = Math.ceil(height / 2);

  const stack = [];
  let current = fullMaze[0][0]; // Start at top-left
  current.visited = true;
  stack.push(current);

  while (stack.length > 0) {
    current = stack.pop();
    // Get neighbors ONLY within the quadrant
    const neighbors = getUnvisitedNeighbors(current, fullMaze, quadWidth, quadHeight);

    if (neighbors.length > 0) {
      stack.push(current);
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      removeWall(current, neighbor);
      
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }
  return fullMaze;
}`}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

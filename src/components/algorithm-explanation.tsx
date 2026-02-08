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
        <CardTitle className="font-headline text-3xl">How It Works: Symmetrical Two-Player Generation</CardTitle>
        <CardDescription>
          This maze is generated to be perfectly symmetrical for two players on opposite sides of the grid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">The Algorithm Steps</h3>
          <p className="text-muted-foreground mb-4">
            To ensure fairness, we generate one quadrant and then mirror it horizontally.
          </p>
          <ul className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Step 1: Initialize Grid.</strong> A complete grid is created with all walls intact.</li>
              <li><strong>Step 2: Generate Top-Left Quadrant.</strong> We use Randomized Depth-First Search (DFS) to carve a maze, but only within the boundaries of the top-left quadrant.</li>
              <li><strong>Step 3: Mirror Horizontally.</strong> The generated quadrant is then mirrored to the top-right quadrant. For each cell, its 'left' wall becomes the mirrored cell's 'right' wall, and vice-versa, creating a perfect reflection.</li>
              <li><strong>Step 4: Untouched Bottom Half.</strong> The bottom two quadrants are left as solid blocks of cells, creating a clear boundary for the play area.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Core Logic Snippet</h3>
          <p className="text-muted-foreground mb-4">
            The key is generating one quadrant and then performing a precise wall-swapping mirror operation.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// After generating the top-left quadrant with DFS...

// Mirror the top-left quadrant to the top-right.
for (let y = 0; y < quadHeight; y++) {
  for (let x = 0; x < quadWidth; x++) {
    const sourceCell = fullMaze[y][x];
    const mirrorX = width - 1 - x;
    const mirrorCell = fullMaze[y][mirrorX];
    
    mirrorCell.top = sourceCell.top;
    mirrorCell.bottom = sourceCell.bottom;
    mirrorCell.left = sourceCell.right;    // SWAP
    mirrorCell.right = sourceCell.left;   // SWAP
    mirrorCell.visited = sourceCell.visited;
  }
}`}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

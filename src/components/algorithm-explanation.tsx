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
        <CardTitle className="font-headline text-3xl">How It Works: Four-Way Symmetrical Generation</CardTitle>
        <CardDescription>
          This maze is generated to be perfectly symmetrical for four players starting from each corner.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">The Algorithm Steps</h3>
          <p className="text-muted-foreground mb-4">
            To ensure perfect fairness, we generate a single quadrant and then mirror it across both axes to construct the full maze.
          </p>
          <ul className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Step 1: Generate a Quadrant.</strong> We use Randomized Depth-First Search (DFS) to carve a maze within a grid that is one-quarter of the total size.</li>
              <li><strong>Step 2: Open Center Path.</strong> Before mirroring, we remove the bottom and right walls of the bottom-right cell in the quadrant. This ensures a path to the center is created when mirrored.</li>
              <li><strong>Step 3: Mirror to Create Full Maze.</strong> The single quadrant is mirrored three times to create the other quadrants:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>The top-right quadrant is a horizontal mirror.</li>
                    <li>The bottom-left quadrant is a vertical mirror.</li>
                    <li>The bottom-right quadrant is a horizontal and vertical mirror.</li>
                  </ul>
              </li>
              <li><strong>Step 4: Guaranteed Fairness.</strong> This process ensures that each player has an identical, but rotated/mirrored, path to the center, making the challenge perfectly fair.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Core Logic Snippet</h3>
          <p className="text-muted-foreground mb-4">
            The key is generating one quadrant and then performing four-way mirroring with wall swaps.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code className="font-code text-muted-foreground">
{`// After generating a single quadrant...
quadrant[quadHeight - 1][quadWidth - 1].right = false;
quadrant[quadHeight - 1][quadWidth - 1].bottom = false;

// ... then, for each cell in the quadrant, create 4 cells in the full maze.

// Bottom-Right (Horizontal & Vertical Mirror)
const brX = width - 1 - x;
const brY = height - 1 - y;
fullMaze[brY][brX] = {
  //...
  top: sourceCell.bottom, // Vertical Swap
  bottom: sourceCell.top, // Vertical Swap
  left: sourceCell.right, // Horizontal Swap
  right: sourceCell.left, // Horizontal Swap
  //...
};
`}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

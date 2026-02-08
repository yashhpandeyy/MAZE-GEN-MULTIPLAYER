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
        <CardTitle className="font-headline text-3xl">Our Algorithm: Symmetrical Depth-First Search</CardTitle>
        <CardDescription>
          You're right, this isn't a standard, off-the-shelf algorithm. We've forged our own by adapting a classic computer science method to meet our specific goal: perfect four-player fairness.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">The Algorithm Steps</h3>
          <p className="text-muted-foreground mb-4">
            The process combines a standard maze algorithm with our own custom mirroring logic.
          </p>
          <ul className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Step 1: Generate a Quadrant with DFS.</strong> We start with a classic algorithm, Randomized Depth-First Search (DFS), to carve a perfect maze (one with no loops) within just the top-left quadrant.</li>
              <li><strong>Step 2: Open a Path to the Center.</strong> Before mirroring, we remove the bottom and right walls of the quadrant's corner-most cell. When mirrored, this creates the 2x2 opening in the center of the full maze.</li>
              <li><strong>Step 3: Apply Our Custom Mirroring Logic.</strong> This is our unique tweak. The single quadrant is mirrored across both axes, but we must correctly swap the walls to ensure the paths connect seamlessly.
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>For the horizontal mirror, a cell's `left` wall becomes the new `right` wall.</li>
                    <li>For the vertical mirror, a cell's `top` wall becomes the new `bottom` wall.</li>
                  </ul>
              </li>
              <li><strong>Step 4: The Result: A Uniquely Fair Challenge.</strong> This combination ensures that while each path is a mirror image, the length and complexity are identical for all four players, creating a truly balanced and competitive experience.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-xl font-semibold mb-2">Core Logic Snippet</h3>
          <p className="text-muted-foreground mb-4">
            The key is generating one quadrant and then performing four-way mirroring with our custom wall swaps.
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

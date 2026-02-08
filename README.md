Our Algorithm: Symmetrical Depth-First Search
You're right, this isn't a standard, off-the-shelf algorithm. We've forged our own by adapting a classic computer science method to meet our specific goal: perfect four-player fairness.
The Algorithm Steps
The process combines a standard maze algorithm with our own custom mirroring logic.

Step 1: Generate a Quadrant with DFS. We start with a classic algorithm, Randomized Depth-First Search (DFS), to carve a perfect maze (one with no loops) within just the top-left quadrant.
Step 2: Open a Path to the Center. Before mirroring, we remove the bottom and right walls of the quadrant's corner-most cell. When mirrored, this creates the 2x2 opening in the center of the full maze.
Step 3: Apply Our Custom Mirroring Logic. This is our unique tweak. The single quadrant is mirrored across both axes, but we must correctly swap the walls to ensure the paths connect seamlessly.
For the horizontal mirror, a cell's `left` wall becomes the new `right` wall.
For the vertical mirror, a cell's `top` wall becomes the new `bottom` wall.
Step 4: The Result: A Uniquely Fair Challenge. This combination ensures that while each path is a mirror image, the length and complexity are identical for all four players, creating a truly balanced and competitive experience.
Core Logic Snippet
The key is generating one quadrant and then performing four-way mirroring with our custom wall swaps.

// After generating a single quadrant...
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
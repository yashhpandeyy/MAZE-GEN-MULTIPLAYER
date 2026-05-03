# Procedural Maze Gen

An interactive web application designed to create complex, symmetrical mazes using a unique, custom-developed algorithm. Built for competitive fairness and aesthetic precision.

## The Algorithm: Symmetrical Depth-First Search

This isn't a standard, off-the-shelf algorithm. We've forged our own by adapting a classic computer science method to meet the specific goal of perfect four-player fairness.

### The Process

1.  **Generate a Quadrant with DFS:** We start with a classic Randomized Depth-First Search (DFS) to carve a perfect maze (one with no loops) within just the top-left quadrant.
2.  **Open a Path to the Center:** Before mirroring, we remove the bottom and right walls of the quadrant's corner-most cell.
3.  **Apply Custom Mirroring Logic:** The quadrant is mirrored across both axes. We use custom wall-swap logic to ensure paths connect seamlessly (e.g., a `left` wall in the original becomes a `right` wall in the horizontal mirror).
4.  **The Result:** A perfectly balanced challenge where all four players have identical path complexity to the center.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Animation:** Custom requestAnimationFrame loop for real-time carving visualization.

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
4.  Open [http://localhost:9002](http://localhost:9002) in your browser.
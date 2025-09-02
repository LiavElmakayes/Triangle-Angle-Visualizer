## Triangle Angle Visualizer (React)

### Overview
This project is a small React application (JavaScript) with two pages:
- Input page to enter three 2D points (X, Y)
- Display page that renders a triangle defined by those points inside an SVG, draws a small arc at each vertex, and calculates + displays the internal angles in degrees

Key features:
- React Router navigation between Input and Display pages
- SVG-based triangle rendering with angle arcs and labels
- Responsive layout that scales on smaller screens
- Persistent coordinates using a context backed by localStorage

Technologies:
- React (Create React App)
- react-router-dom
- SVG for rendering

### Setup
1) Install dependencies
```bash
npm install
```
2) Start the dev server
```bash
npm start
```
The app runs on `http://localhost:3000/` by default.

### Structure
- `src/pages/InputPage/` — inputs for three points (A, B, C), navigation to display
- `src/pages/DisplayPage/` — 800×800 SVG canvas (responsive), triangle polygon, vertex arcs, angle labels
- `src/components/PointInputs/` — reusable input rows for points
- `src/components/TriangleSVG/` — triangle rendering, arc drawing, and angle computations
- `src/context/PointsContext.js` — shared state for points with localStorage persistence

### Usage
1) Enter coordinates for points A, B, and C on the Input page.
2) Click “Show Triangle” to navigate to the Display page.
3) Inspect the triangle, vertex arcs, and internal angles. Use the “Back to Input” button to adjust points; your last inputs are preserved.

### How it Works
#### Triangle drawing method — and why
- The triangle is drawn using SVG: a `<polygon>` for the edges/fill, three `<circle>` elements for vertices, and `<path>` arc segments (SVG `A` command) at each vertex to visualize angles.
- SVG is chosen for precision, scalability, and ease of overlaying shapes, text, and paths that respond crisply at any resolution.

#### Angle calculation approach
For three points A, B, C, the internal angle at A is computed via the dot-product formula:
- Vectors: `AB = B − A`, `AC = C − A`
- Angle: `θ_A = arccos( (AB · AC) / (|AB||AC|) )`
Angles at B and C are computed analogously. Values are displayed in degrees.

#### Challenges
- SVG arc flags: Reliability of drawing the minor arc at each vertex requires setting the sweep and large-arc flags carefully in the SVG coordinate system (Y increases downward).
- Label placement and overlap: For acute or clustered vertices, angle labels can collide with arcs or edges. The app dynamically adjusts arc radii and pushes labels outward along the angle bisector, and applies a simple de-overlap nudge with clamping to the viewbox.
- Responsiveness: Maintaining readability while scaling the 800×800 SVG down on small screens. The SVG uses `viewBox` with responsive sizing and preserved aspect ratio.

#### Unresolved or gaps
- None functionally. For extreme geometries, a more advanced label layout (multi-pass de-overlap or leader lines) could further improve readability.

### External Tools / AI Usage
- Verifying and confirming the correct formula for triangle angle calculation
- Quickly adding clear comments to the code for better readability and clean code
- Structuring the README content efficiently and professionally
- Suggesting responsive design approaches for SVG and overall layout
- Providing ideas for component structure and code organization

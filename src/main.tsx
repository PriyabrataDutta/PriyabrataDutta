/**
 * main.tsx — The entry point of the React application.
 *
 * What happens here, step by step:
 *   1. Vite loads this file first (configured in index.html as the script src).
 *   2. We import our root <App /> component and the global CSS.
 *   3. `createRoot` connects React to the <div id="root"> element in
 *      index.html — that's where the entire UI gets mounted.
 *   4. `.render(<App />)` paints our app into that <div>.
 *
 * The `!` after getElementById tells TypeScript: "trust me, this element
 * exists" (because it's hard-coded in index.html). Without it, TS would
 * complain that the value could be null.
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

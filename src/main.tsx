import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Backward compatibility: migrate old HashRouter URLs (/#/path) to BrowserRouter (/path).
if (window.location.hash.startsWith("#/")) {
  const nextUrl = `${window.location.hash.slice(1)}${window.location.search}`;
  window.history.replaceState(null, "", nextUrl);
}

createRoot(document.getElementById("root")!).render(<App />);

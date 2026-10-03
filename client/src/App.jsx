import { RouterProvider } from "react-router-dom";
import "./App.css";
import { routes } from "./Routes/routes";

// No artificial splash delay: the router renders immediately and each lazy
// route shows its own lightweight loader while its chunk downloads.
function App() {
  return <RouterProvider router={routes} />;
}

export default App;

import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { routes } from "./Routes/routes";
import { Toaster } from "sonner";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import image from "./assets/icon.png";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer); 
  }, []);

  // If loading, show the loading page
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={image} alt="Loading..." className="w-[150px] h-[120px] mx-auto mt-10" />
    </div>;
  }

  // Otherwise, render the main app
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster expand={true} richColors />
    </>
  );
}

export default App;
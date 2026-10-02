import { useEffect } from "react";

const DashboardTitle = ({ text, children, windowTitle }) => {

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${windowTitle ? windowTitle : ""} | INKSPIRE`;
    }
  }, [windowTitle]);

  return (

      <h2 className="text-xl font-Poppins">
        {text} {children}
      </h2>
  );
};

export default DashboardTitle;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import  {persistor, store}  from "./redux/store/store.js"
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { LanguageProvider } from "./i18n/LanguageProvider";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
    <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
    <Toaster position="top-center" richColors closeButton />
      <App />
    </PersistGate>
    </Provider>
    </LanguageProvider>
  </React.StrictMode>
);

// Installable app + offline fallback. Only in production builds so the dev
// server is never served stale files.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

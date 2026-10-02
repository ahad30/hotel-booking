import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import  {persistor, store}  from "./redux/store/store.js"
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
    <Toaster expand={true} richColors />
      <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>
);

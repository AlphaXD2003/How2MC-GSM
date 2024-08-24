import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./globals.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { mainRouter, Route } from "./constants/mainRouter.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Provider } from 'react-redux'
import { store } from './store/store'
const router = createBrowserRouter(mainRouter as Route[]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  
    
<Provider store={store}>
<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <RouterProvider router={router} />
</ThemeProvider>
</Provider>
   
  
);

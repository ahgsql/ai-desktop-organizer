import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import AiOrganize from "./AiOrganize.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/ai-organize",
    element: <AiOrganize />,
  },
]);
const theme = createTheme({
  /** Put your mantine theme override here */
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider theme={theme}>
    <RouterProvider router={router} />
  </MantineProvider>
);

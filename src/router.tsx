import { createBrowserRouter } from "react-router-dom";

import Builder from "./pages/Builder";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Builder />,
      },
    ],
  },
]);

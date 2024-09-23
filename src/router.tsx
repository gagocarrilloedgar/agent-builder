import { createBrowserRouter } from "react-router-dom";

import { ErrorPage } from "./pages/ErrorPage";
import Builder from "./pages/Workflow";

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

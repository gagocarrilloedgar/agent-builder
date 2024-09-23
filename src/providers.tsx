
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ReactFlowProvider } from "@xyflow/react";

import { Toaster } from "./components/ui/toaster.tsx";
import { DnDProvider } from "./pages/Builder/DnDProvider.tsx";
import WorkflowProvider from "./pages/Builder/WorkflowProvider.tsx";

import { RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { createSupabaseWorkflowRepository } from "./modules/workflows/infra";
import { router } from "./router.tsx";

const workflowRepository = createSupabaseWorkflowRepository();

export const Providers = () => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <TooltipProvider delayDuration={0}>
      <DnDProvider>
        <ReactFlowProvider>
          <WorkflowProvider repository={workflowRepository}>
            <Layout>
              <RouterProvider router={router} />
              <Toaster />
            </Layout>
          </WorkflowProvider>
        </ReactFlowProvider>
      </DnDProvider>
    </TooltipProvider>
  </ThemeProvider>
);

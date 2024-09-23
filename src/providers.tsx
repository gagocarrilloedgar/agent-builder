import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ReactFlowProvider } from "@xyflow/react";

import { Toaster } from "./components/ui/toaster.tsx";
import { DnDProvider } from "./pages/Workflow/DragDropProvider.tsx";
import WorkflowProvider from "./pages/Workflow/WorkflowsProvider.tsx";

import { PropsWithChildren } from "react";
import { RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { WorkflowsRepository } from "./modules/workflows/domain/WorkflowsRepository.ts";
import { createSupabaseWorkflowRepository } from "./modules/workflows/infra";
import { router } from "./router.tsx";

const workflowRepository = createSupabaseWorkflowRepository();

export const Providers = () => (
  <ProviderWrapper repository={workflowRepository}>
    <RouterProvider router={router} />
  </ProviderWrapper>
);

export const ProviderWrapper = ({
  repository,
  children,
}: PropsWithChildren<{
  repository: WorkflowsRepository;
}>) => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <TooltipProvider delayDuration={0}>
      <DnDProvider>
        <ReactFlowProvider>
          <WorkflowProvider repository={repository}>
            <Layout>
              {children}
              <Toaster />
            </Layout>
          </WorkflowProvider>
        </ReactFlowProvider>
      </DnDProvider>
    </TooltipProvider>
  </ThemeProvider>
);

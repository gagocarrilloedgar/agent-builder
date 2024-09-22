import { PropsWithChildren } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { ReactFlowProvider } from "@xyflow/react";

import { Toaster } from "./components/ui/toaster.tsx";
import { DnDProvider } from "./pages/Builder/DnDProvider.tsx";
import WorkflowProvider from "./pages/Builder/WorkflowProvider.tsx";
import { Layout } from "./pages/index.tsx";

import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { createSupabaseWorkflowRepository } from "./modules/workflows/infra";

const workflowRepository = createSupabaseWorkflowRepository();

export const Providers = ({ children }: PropsWithChildren) => (
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <TooltipProvider delayDuration={0}>
      <DnDProvider>
        <ReactFlowProvider>
          <WorkflowProvider repository={workflowRepository}>
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

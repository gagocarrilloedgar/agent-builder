import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import Builder from "@/pages/builder";

import { ReactFlowProvider } from "@xyflow/react";
import { Toaster } from "./components/ui/toaster.tsx";
import { DnDProvider } from "./DnDProvider.tsx";
import "./index.css";
import WorkflowProvider from "./pages/builder/provider.tsx";
import { Layout } from "./pages/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={0}>
        <DnDProvider>
          <ReactFlowProvider>
            <WorkflowProvider>
              <Layout>
                <Builder />
                <Toaster />
              </Layout>
            </WorkflowProvider>
          </ReactFlowProvider>
        </DnDProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
);

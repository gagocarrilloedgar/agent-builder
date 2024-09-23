import { useContext } from "react";
import { WorkflowContext } from "./WorkflowContext";

export const useCurrentWorkflow = () => {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error(
      "useCurrentWorkflow must be used within a WorkflowProvider"
    );
  }

  return context;
};

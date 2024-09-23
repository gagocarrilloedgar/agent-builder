import { ReactFlowEdge } from "./Edge";
import { ReactFlowNode } from "./Node";

export interface FlowWorkflow {
  id: number;
  data: {
    generalInstructions: string;
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
  };
}

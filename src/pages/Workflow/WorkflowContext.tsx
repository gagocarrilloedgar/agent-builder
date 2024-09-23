/* eslint-disable react-hooks/exhaustive-deps */
import {
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";


import {
  FlowWorkflow,
  ReactFlowEdge,
  ReactFlowNode,
} from "@/modules/workflows/domain";

import "@xyflow/react/dist/style.css";
import { createContext } from "react";

export const WorkflowContext = createContext<{
  currentWorkflow: FlowWorkflow | null;
  currentNode: ReactFlowNode | null;
  edges: ReactFlowEdge[];
  nodes: ReactFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<ReactFlowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<ReactFlowEdge[]>>;
  onSetCurrentNode: (nodeId: string | null) => void;
  updateUserDataProp: <
    T extends keyof NonNullable<ReactFlowNode["userData"]>[number]
  >(
    nodeId: string,
    property: T,
    index: number
  ) => (value: NonNullable<ReactFlowNode["userData"]>[number][T]) => void;
  updateNodeProperty: <K extends keyof ReactFlowNode>(
    nodeId: string,
    property: K
  ) => (value: ReactFlowNode[K]) => void;
  onNodesChange: OnNodesChange<ReactFlowNode>;
  onEdgesChange: OnEdgesChange<ReactFlowEdge>;
  addNewUserData: () => void;
  setEdgeChanged: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  currentWorkflow: null,
  currentNode: null,
  edges: [],
  nodes: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  onSetCurrentNode: () => {},
  updateNodeProperty: () => () => {},
  updateUserDataProp: () => () => {},
  addNewUserData: () => {},
  setEdgeChanged: () => {},
});

// src/types/index.ts

export const nodeTypes = <const>[
  "start_call",
  "waypoint",
  "end_call",
  "default",
  "transfer_call",
];

export const publicNodeTypes = nodeTypes.filter((type) => type !== "default");

// nodeTypesArray will be a tuple with these string literals
export type NodeNodeTypes = (typeof nodeTypes)[number];
export type PublicNodeTypes = (typeof publicNodeTypes)[number];

export const userDataType = <const>["string", "integer", "boolean", "float"];

export type UserDataType = (typeof userDataType)[number];

export interface UINode {
  id: number;
  nodeType: NodeNodeTypes;
  nodeName: string;
  prompt: string;
  nodeEnterCondition: string;
  userData: {
    name: string;
    dataType: UserDataType;
    description: string;
  }[];
}

export interface UIEdge {
  id: number;
  source: number;
  target: number;
  label: string | null;
}

export interface UIWorkflow {
  id: number;
  data: {
    generalInstructions: string;
    nodes: UINode[];
    edges: UIEdge[];
  };
}

export interface ReactFlowNode {
  id: string;
  type: NodeNodeTypes;
  nodeName?: string;
  prompt?: string;
  nodeEnterCondition?: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
  selected?: boolean;
  userData?: {
    name: string;
    dataType: UserDataType;
    description: string;
  }[];
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string | null;
  animated: boolean;
}

export interface FlowWorkflow {
  id: number;
  generalInstructions: string;
  data: {
    nodes: ReactFlowNode[];
    edges: ReactFlowEdge[];
  };
}

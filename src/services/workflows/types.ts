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

export type UserDataType = "string" | "integer" | "boolean" | "float";

export interface Node {
  id: number;
  node_type: NodeNodeTypes;
  node_name: string;
  prompt: string;
  node_enter_condition?: string;
  user_data?: {
    name: string;
    data_type: UserDataType;
    description: string;
  }[];
}

export interface BuilderNode {
  id: string;
  position: { x: number; y: number };
  type: NodeNodeTypes;
  data: { label: string };
}

export interface Edge {
  id: number;
  source: number;
  label: string | null;
  target: number;
}

export interface Workflow {
  id: number;
  data: {
    general_instructions: string;
    nodes: Node[];
    edges: Edge[];
  };
}

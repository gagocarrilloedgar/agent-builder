// src/types/index.ts

export const nodeTypes = <const>[
  "start_call",
  "waypoint",
  "end_call",
  "default",
  "transfer_call",
];

export const publicNodeTypes = nodeTypes.filter((type) => type !== "default");

export type NodeNodeTypes = (typeof nodeTypes)[number];
export type PublicNodeTypes = (typeof publicNodeTypes)[number];

export const userDataType = <const>["string", "integer", "boolean", "float"];

export type UserDataType = (typeof userDataType)[number];

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

import { NodeProps } from "@xyflow/react";
import {
  Phone,
} from "lucide-react";
import { memo } from "react";

import { BaseNode } from "./BaseNode";

function StartCallComponent(props: NodeProps) {
  return (
    <BaseNode isStart label="Start call" className="bg-emerald-500" {...props}>
      <Phone size="18" color="white" />
    </BaseNode>
  );
}

export const StartCallNode = memo(StartCallComponent);

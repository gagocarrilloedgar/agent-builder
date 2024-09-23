import { NodeProps } from "@xyflow/react";
import {
  PhoneOff,
} from "lucide-react";
import { memo } from "react";
import { BaseNode } from "./BaseNode";

function EndCallComponent(props: NodeProps) {
  return (
    <BaseNode isEnd className="bg-rose-600" label={"End call"} {...props}>
      <PhoneOff size="18" color="white" />
    </BaseNode>
  );
}

export const EndCallNode = memo(EndCallComponent);

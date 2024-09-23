import { NodeProps } from "@xyflow/react";
import { Waypoints } from "lucide-react";
import { memo } from "react";
import { BaseNode } from "./BaseNode";

function WaypointComponent(props: NodeProps) {
  return (
    <BaseNode className="bg-purple-600" label="Action" {...props}>
      <Waypoints size="18" color="white" />
    </BaseNode>
  );
}

export const WaypointNode = memo(WaypointComponent);

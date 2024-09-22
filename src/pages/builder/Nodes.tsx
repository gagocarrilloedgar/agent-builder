import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Handle, NodeProps, Position } from "@xyflow/react";
import {
  AlertCircle,
  EllipsisVertical,
  Phone,
  PhoneOff,
  Waypoints,
} from "lucide-react";
import { ComponentPropsWithoutRef, memo, useEffect } from "react";
import { useCurrentWorkflow } from "./WorkflowProvider";

function StartCallComponent(props: NodeProps) {
  return (
    <BaseNode isStart label="Start call" className="bg-emerald-500" {...props}>
      <Phone size="18" color="white" />
    </BaseNode>
  );
}

function WaypointComponent(props: NodeProps) {
  return (
    <BaseNode className="bg-purple-600" label="Action" {...props}>
      <Waypoints size="18" color="white" />
    </BaseNode>
  );
}

function EndCallComponent(props: NodeProps) {
  return (
    <BaseNode isEnd className="bg-rose-600" label={"End call"} {...props}>
      <PhoneOff size="18" color="white" />
    </BaseNode>
  );
}

export const EndCallNode = memo(EndCallComponent);
export const StartCallNode = memo(StartCallComponent);
export const WaypointNode = memo(WaypointComponent);

type BaseNodeProps = NodeProps &
  ComponentPropsWithoutRef<"div"> & {
    label: string;
    isStart?: boolean;
    isEnd?: boolean;
  };

const BaseNode = memo(BaseNodeComponent);

function BaseNodeComponent({
  children,
  label,
  className,
  isStart,
  isEnd,
  selected,
  id,
}: BaseNodeProps) {
  const { onSetCurrentNode, nodes } = useCurrentWorkflow();
  const currentNode = nodes?.find((node) => node.id === id);

  useEffect(() => {
    if (selected && id) {
      onSetCurrentNode(id);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, id]);

  const title = currentNode?.nodeName;
  const description = currentNode?.prompt;

  const nodeDataMissing =
    !title ||
    !description ||
    (!currentNode.nodeEnterCondition && currentNode.type !== "start_call");

  return (
    <Card className={cn("relative", selected && "border-primary")}>
      <div
        className={cn(
          "flex -z-10  border-t font-light border-r border-l absolute -top-4 left-6 w-1/4 h-4 rounded-t-md justify-center items-center",
          `${className} ${selected && "border-primary"}`
        )}
      >
        <p className="text-xs text-center text-white">{label}</p>
      </div>
      {nodeDataMissing && (
        <Tooltip>
          <TooltipTrigger asChild>
            <section className="flex bg-red-500 font-light rounded-full absolute -top-1.5 -right-1.5 w-4 h-4 justify-center items-center">
              <AlertCircle size="18" color="white" />
            </section>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={2}>
            Some noe properties are missing
          </TooltipContent>
        </Tooltip>
      )}
      <Handle
        className={`h-3 w-3 ${
          selected ? "bg-primary" : "bg-border"
        }  border-none`}
        hidden={isStart}
        type="target"
        position={Position.Top}
      />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 p-4 items-center">
          <section className={cn("p-0.5 rounded-sm", className)}>
            {children}
          </section>
          <p className="text-base font-medium">{title}</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical size="18" color="black" fill="black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={2}>
            Edit node
          </TooltipContent>
        </Tooltip>
      </div>
      <Separator />
      <p className="overflow-hidden truncate w-64 p-4 text-sm">{description}</p>
      <Handle
        hidden={isEnd}
        className={`h-3 w-3 ${
          selected ? "bg-primary" : "bg-border"
        }  border-none`}
        type="source"
        position={Position.Bottom}
        id="a"
      />
    </Card>
  );
}

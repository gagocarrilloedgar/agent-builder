import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  FinalConnectionState,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDnD } from "@/DnDProvider";
import { NodeNodeTypes } from "@/services/workflows/types";
import "@xyflow/react/dist/style.css";
import { PhoneOff, Waypoints } from "lucide-react";
import { DragEvent, useCallback, useEffect, useState } from "react";
import { EndCallNode, StartCallNode, WaypointNode } from "./Nodes";
import { useCurrentWorkflow } from "./provider";

// Constants for spacing

export function BuilderComponent() {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onSetCurrentNode,
    handleNewNode: addNode,
  } = useCurrentWorkflow();

  const [open, setOpen] = useState(false);
  const [onEndConntectionState, setOnEndConntectionState] =
    useState<FinalConnectionState | null>(null);
  const [onEndPosition, setOnEndPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { nodeType: dndNodeType } = useDnD();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!dndNodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = Number(nodes[nodes.length - 1]?.id) + 1 || 0;

      const newNode = {
        id: id.toString(),
        type: dndNodeType,
        position,
        data: { label: `${dndNodeType} node` },
      };

      setNodes((nds) => nds.concat(newNode));
      addNode(newNode);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screenToFlowPosition, dndNodeType, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges]
  );

  const handleNewNode = useCallback(
    (type: NodeNodeTypes) => {
      if (!onEndConntectionState || !onEndPosition) return;
      // when a connection is dropped on the pane it's not valid
      const isEndNode = onEndConntectionState.fromNode?.type == "end_call";

      // we need to remove the wrapper bounds, in order to get the correct position
      const id = Number(nodes[nodes.length - 1]?.id) + 1 || 0;
      const newNode = {
        id: id.toString(),
        position: screenToFlowPosition({
          x: onEndPosition.x,
          y: onEndPosition.y,
        }),
        type,
        data: { label: `Node ${id}` },
        origin: [0.5, 0.0],
      };

      setNodes((nds) => nds.concat(newNode));
      const sourceNodeId = isEndNode
        ? id.toString()
        : onEndConntectionState?.fromNode?.id;
      const targetNodeId = isEndNode
        ? onEndConntectionState?.fromNode?.id
        : id.toString();

      if (!sourceNodeId || !targetNodeId) return;

      setEdges((eds) =>
        eds.concat({
          id: id.toString(),
          source: sourceNodeId,
          target: targetNodeId,
          animated: true,
        })
      );

      setOpen(false);
      setOnEndConntectionState(null);
      setOnEndPosition(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      onEndConntectionState,
      screenToFlowPosition,
      setEdges,
      setNodes,
      setOpen,
      onEndPosition,
    ]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (!connectionState.isValid) {
        const isEndNode = connectionState.fromNode?.type == "end_call";

        if (!isEndNode) setOpen(true);

        setOnEndConntectionState(connectionState);

        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        setOnEndPosition({
          x: clientX,
          y: clientY,
        });
      }
    },
    []
  );

  useEffect(() => {
    const isEndNode = onEndConntectionState?.fromNode?.type == "end_call";
    if (!isEndNode || onEndConntectionState?.isValid) return;

    handleNewNode("waypoint");
  }, [onEndConntectionState, handleNewNode]);

  const cleanSelection = useCallback(() => {
    onSetCurrentNode(null);
  }, [onSetCurrentNode]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New node</DialogTitle>
            <DialogDescription>
              Select the type of node you want to create
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={() => handleNewNode("waypoint")}>
              <Waypoints size="18" className="mr-2" />
              Action
            </Button>
            <Button variant="outline" onClick={() => handleNewNode("end_call")}>
              <PhoneOff size="18" className="mr-2" />
              End call
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ReactFlow
        colorMode="light"
        nodes={nodes}
        edges={edges}
        nodeTypes={{
          start_call: StartCallNode,
          waypoint: WaypointNode,
          transfer_call: WaypointNode,
          end_call: EndCallNode,
        }}
        onPaneClick={cleanSelection}
        onConnectEnd={onConnectEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={20} />
      </ReactFlow>
    </>
  );
}

export default function Builder() {
  const { nodes } = useCurrentWorkflow();

  if (!nodes)
    return (
      <>
        <Background variant={BackgroundVariant.Dots} gap={20} />;
      </>
    );

  return <BuilderComponent />;
}

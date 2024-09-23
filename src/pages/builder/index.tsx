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

import { NodeNodeTypes } from "@/modules/workflows/domain";
import { useDnD } from "@/pages/Builder/DnDProvider";
import "@xyflow/react/dist/style.css";
import { DragEvent, useCallback, useEffect, useState } from "react";
import { NewNodeDialog } from "./NewNodeDialog";
import { NodeEditor } from "./NodeEditor";
import { EndCallNode, StartCallNode, WaypointNode } from "./Nodes";
import { useCurrentWorkflow } from "./useCurrentWorkflow";

// Constants for spacing

export function BuilderComponent() {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    currentNode,
    onSetCurrentNode,
    setEdgeChanged,
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

      setNodes((nds) => {
        const id = Number(nds[nds.length - 1]?.id) + 1 || 0;

        const newNode = {
          id: id.toString(),
          type: dndNodeType,
          nodeType: dndNodeType,
          nodeName: undefined,
          prompt: undefined,
          selected: true,
          nodeEnterCondition: undefined,
          userData: [],
          position,
          data: { label: `${dndNodeType} node` },
        };

        return nds.concat(newNode);
      });
    },
    [screenToFlowPosition, dndNodeType, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdgeChanged(true);
      setEdges((eds) => {
        const lastId = Number(eds[eds.length - 1]?.id) + 1 || 0;
        return addEdge(
          { ...params, id: lastId.toString(), animated: true },
          eds
        );
      });
    },
    [setEdges, setEdgeChanged]
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
        nodeName: undefined,
        prompt: undefined,
        nodeEnterCondition: undefined,
        userData: [],
        position: screenToFlowPosition({
          x: onEndPosition.x,
          y: onEndPosition.y,
        }),
        type,
        nodeType: type,
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
    [
      nodes,
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

  const handlePaste = useCallback(() => {
    if (!currentNode) return;

    setNodes((nds) => {
      const id = Number(nds[nds.length - 1]?.id) + 1 || 0;
      const newNodes = {
        ...currentNode,
        id: id.toString(),
        selected: false,
        position: {
          x: currentNode.position.x + 150,
          y: currentNode.position.y + 150,
        },
      };

      return nds.concat(newNodes);
    });
  }, [setNodes, currentNode]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        // Fix this key code for an approach that is not based on key codes
        (event.metaKey || event.ctrlKey || event.keyCode === 91) &&
        event.key === "v"
      ) {
        handlePaste();
      }
    },
    [handlePaste]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <NewNodeDialog
        open={open}
        setOpen={setOpen}
        handleNewNode={handleNewNode}
      />
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
        <Background variant={BackgroundVariant.Dots} gap={15} />
      </ReactFlow>
    </>
  );
}

function Builder() {
  const { nodes } = useCurrentWorkflow();

  if (!nodes)
    return (
      <>
        <Background variant={BackgroundVariant.Dots} gap={20} />;
      </>
    );

  return <BuilderComponent />;
}

const WorkflowBuilder = () => {
  return (
    <>
      <div className="flex-grow h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Builder />
        </main>
      </div>
      <NodeEditor />
    </>
  );
};

export default WorkflowBuilder;

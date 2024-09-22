import { Edge } from "@xyflow/react";

import { getWorkflows } from "@/services/workflows/subpabse";

import { formatName } from "@/lib/formatSnake";
import { FlowWorkflow, ReactFlowNode } from "@/services/workflows/types";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { createContext, useContext, useEffect, useState } from "react";

const WorkflowContext = createContext<{
  currentWorkflow: FlowWorkflow | null;
  currentNode: ReactFlowNode | null;
  onSetCurrentNode: (nodeId: string | null) => void;
  handleNewNode: (node: ReactFlowNode) => void;
}>({
  currentWorkflow: null,
  currentNode: null,
  onSetCurrentNode: () => {},
  handleNewNode: () => {},
});

export default function WorkflowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentWorkflow, setCurrentWorkflow] = useState<FlowWorkflow | null>(
    null
  );

  const [currentNode, setCurrentNode] = useState<ReactFlowNode | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getWorkflows();
      const currenWorkflow = res[0];
      if (!currenWorkflow) return;

      const currentNodes = currenWorkflow.data.nodes.map(
        (node, index: number) => {
          const type =
            index === 0
              ? "start_call"
              : node.nodeType === "default"
              ? "waypoint"
              : node.nodeType;

          return {
            ...node,
            nodeName: formatName(node.nodeName),
            id: node.id.toString(),
            position: { x: 0, y: 0 },
            data: { label: node.prompt },
            type,
          };
        }
      );

      const currentEdges = currenWorkflow.data.edges.map((edge) => ({
        ...edge,
        id: edge.id.toString(),
        source: edge.source.toString(),
        target: edge.target.toString(),
        animated: true,
      }));

      const layoutedNodes: ReactFlowNode[] = layoutNodesWithDagre(
        currentNodes,
        currentEdges
      );

      setCurrentWorkflow({
        id: currenWorkflow.id,
        data: {
          generalInstructions: currenWorkflow.data.generalInstructions,
          nodes: layoutedNodes,
          edges: currentEdges,
        },
      });
    }
    load();
  }, []);

  const onSetCurrentNode = (nodeId: string | null) => {
    const node = currentWorkflow?.data.nodes.find((node) => node.id === nodeId);
    setCurrentNode(node || null);
  };

  const handleNewNode = (node: ReactFlowNode) => {
    setCurrentWorkflow((workflow) => {
      if (!workflow) return null;

      const newNodes = [...workflow.data.nodes, node];
      const newEdges = [...workflow.data.edges];

      return {
        ...workflow,
        data: {
          ...workflow.data,
          nodes: newNodes,
          edges: newEdges,
        },
      };
    });
  };

  return (
    <WorkflowContext.Provider
      value={{ currentWorkflow, currentNode, onSetCurrentNode, handleNewNode }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

const NODE_WIDTH = 250;
const NODE_HEIGHT = 150;

const layoutNodesWithDagre = (nodes: ReactFlowNode[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph properties for spacing
  dagreGraph.setGraph({
    rankdir: "TB", // Direction: Top to Bottom
    nodesep: 50, // Horizontal spacing between nodes
    ranksep: 100, // Vertical spacing between nodes
  });

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run the dagre layout algorithm
  dagre.layout(dagreGraph);

  // Update the positions of the nodes
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      id: node.id,
      type: node.type,
      data: {
        label: node.data.label,
      },
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });
};

export const useCurrentWorkflow = () => {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error(
      "useCurrentWorkflow must be used within a WorkflowProvider"
    );
  }

  return context;
};

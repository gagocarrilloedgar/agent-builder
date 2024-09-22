import { Edge } from "@xyflow/react";

import { getWorkflows } from "@/services/workflows/subpabse";

import { BuilderNode, Node, Workflow } from "@/services/workflows/types";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { createContext, useContext, useEffect, useState } from "react";

export type WorkflowType = {
  id: number;
  generalInstructions: string;
  nodes: BuilderNode[];
  edges: Edge[];
};

const WorkflowContext = createContext<{
  currentWorkflow: WorkflowType | null;
  rawWorkflow: Workflow | null;
  currentNode: Node | null;
  onSetCurrentNode: (nodeId: string | null) => void;
}>({
  currentWorkflow: null,
  rawWorkflow: null,
  currentNode: null,
  onSetCurrentNode: () => {},
});

export default function WorkflowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowType | null>(
    null
  );
  const [currentNode, setCurrentNode] = useState<Node | null>(null);

  const [rawWorkflow, setRawWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getWorkflows();
      const currenWorkflow = res[0];
      if (!currenWorkflow) return;
      setRawWorkflow(currenWorkflow);

      const currentNodes: BuilderNode[] = currenWorkflow.data.nodes.map(
        (node, index: number) => {
          const type =
            index === 0
              ? "start_call"
              : node.node_type === "default"
              ? "waypoint"
              : node.node_type;

          return {
            id: node.id.toString(),
            position: { x: 0, y: 0 },
            data: { label: node.prompt },
            type,
          };
        }
      );

      const currentEdges = currenWorkflow.data.edges.map((edge) => ({
        id: edge.id.toString(),
        source: edge.source.toString(),
        target: edge.target.toString(),
        animated: true,
      }));

      const layoutedNodes = layoutNodesWithDagre(currentNodes, currentEdges);

      setCurrentWorkflow({
        id: currenWorkflow.id,
        generalInstructions: currenWorkflow.data.general_instructions,
        nodes: layoutedNodes,
        edges: currentEdges,
      });
    }
    load();
  }, []);

  const onSetCurrentNode = (nodeId: string | null) => {
    const node = rawWorkflow?.data.nodes.find(
      (n) => n.id.toString() === nodeId
    );
    setCurrentNode(node || null);
  };

  return (
    <WorkflowContext.Provider
      value={{ currentWorkflow, rawWorkflow, currentNode, onSetCurrentNode }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

const NODE_WIDTH = 250;
const NODE_HEIGHT = 150;

const layoutNodesWithDagre = (nodes: BuilderNode[], edges: Edge[]) => {
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

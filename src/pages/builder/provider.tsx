/* eslint-disable react-hooks/exhaustive-deps */
import {
  Edge,
  EdgeChange,
  NodeChange,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import {
  getWorkflows,
  updateWorkflowNodes,
} from "@/services/workflows/subpabse";
import debounce from "lodash/debounce";

import { useToast } from "@/hooks/use-toast";
import { formatName } from "@/lib/formatSnake";
import {
  FlowWorkflow,
  ReactFlowEdge,
  ReactFlowNode,
} from "@/services/workflows/types";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const WorkflowContext = createContext<{
  currentWorkflow: FlowWorkflow | null;
  currentNode: ReactFlowNode | null;
  edges: ReactFlowEdge[];
  nodes: ReactFlowNode[];
  setNodes: React.Dispatch<React.SetStateAction<ReactFlowNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<ReactFlowEdge[]>>;
  onSetCurrentNode: (nodeId: string | null) => void;
  updateUserDataProp: <
    T extends keyof NonNullable<ReactFlowNode["userData"]>[number]
  >(
    nodeId: string,
    property: T,
    index: number
  ) => (value: NonNullable<ReactFlowNode["userData"]>[number][T]) => void;
  updateNodeProperty: <K extends keyof ReactFlowNode>(
    nodeId: string,
    property: K
  ) => (value: ReactFlowNode[K]) => void;
  onNodesChange: OnNodesChange<ReactFlowNode>;
  onEdgesChange: OnEdgesChange<ReactFlowEdge>;
  addNewUserData: () => void;
  setEdgeChanged: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  currentWorkflow: null,
  currentNode: null,
  edges: [],
  nodes: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  onSetCurrentNode: () => {},
  updateNodeProperty: () => () => {},
  updateUserDataProp: () => () => {},
  addNewUserData: () => {},
  setEdgeChanged: () => {},
});

export default function WorkflowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<FlowWorkflow | null>(
    null
  );

  const [currentNode, setCurrentNode] = useState<ReactFlowNode | null>(null);
  const [nodeChanged, setNodeChanged] = useState(false);
  const [edgeChanged, setEdgeChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const res = await getWorkflows();
      const currenWorkflow = res[0];
      if (!currenWorkflow) return;

      const currentNodes = currenWorkflow.data.nodes.map(
        (node, index: number) => {
          const defaultType =
            node.nodeType === "default" ? "waypoint" : node.nodeType;
          const type = index === 0 ? "start_call" : defaultType;

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
        generalInstructions: currenWorkflow.data.generalInstructions,
        data: {
          nodes: layoutedNodes,
          edges: currentEdges,
        },
      });

      setNodes(layoutedNodes);
      setEdges(currentEdges);
    }
    load();
  }, [setNodes, setEdges]);

  const onSetCurrentNode = useCallback(
    (nodeId: string | null) => {
      const node = nodes.find((node) => node.id === nodeId);
      setCurrentNode(node || null);
    },
    [nodes]
  );

  const updateUserDataProp =
    <T extends keyof NonNullable<ReactFlowNode["userData"]>[number]>(
      nodeId: string,
      property: T,
      index: number
    ) =>
    (value: NonNullable<ReactFlowNode["userData"]>[number][T]) => {
      setNodes((nodes) => {
        const newNodes = nodes.map((node) => {
          if (node.id !== nodeId) return node;

          const newUserData = node.userData?.map((data, i) => {
            if (i !== index) return data;

            return {
              ...data,
              [property]: value,
            };
          });

          return {
            ...node,
            userData: newUserData,
          };
        });

        return newNodes;
      });

      setNodeChanged(true);
    };

  const updateNodeProperty =
    <K extends keyof ReactFlowNode>(nodeId: string, property: K) =>
    (value: ReactFlowNode[K]) => {
      setNodes((nodes) => {
        const newNodes = nodes.map((node) => {
          if (node.id !== nodeId) return node;

          return {
            ...node,
            [property]: value,
          };
        });

        return newNodes;
      });

      setNodeChanged(true);
    };

  const addNewUserData = useCallback(() => {
    setNodes((nodes) => {
      const newNodes = nodes.map((node) => {
        if (node.id !== currentNode?.id) return node;

        return {
          ...node,
          userData: node.userData?.concat({
            name: "",
            dataType: "string",
            description: "",
          }),
        };
      });

      return layoutNodesWithDagre(newNodes, edges);
    });
  }, [currentNode, edges, setNodes]);

  const onNodesChangeFlagged = (newNodes: NodeChange<ReactFlowNode>[]) => {
    onNodesChange(newNodes);
    if (
      !currentWorkflow ||
      newNodes.length === currentWorkflow.data.nodes.length
    )
      return;
    setNodeChanged(true);
  };

  const debouncedSave = useCallback(
    debounce(async () => {
      const isSomeNodeInvalid = nodes.some((node) =>
        Object.values(node).some((value) => !value)
      );

      const isSomeEdgeInvalid = edges.some((edge) =>
        Object.entries(edge).some(([key, value]) => key !== "label" && !value)
      );

      if (isSomeNodeInvalid || isSomeEdgeInvalid || !currentWorkflow) return;

      setIsSaving(true);
      toast({ description: "Saving workflow..." });

      try {
        const saved = await updateWorkflowNodes(
          currentWorkflow.id,
          nodes,
          edges
        );

        if (saved?.error) throw new Error(saved.error.message);

        setNodeChanged(false);
        setEdgeChanged(false);
        toast({ description: "Workflow saved successfully" });
      } catch {
        toast({
          description: "An error occurred while saving the workflow",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }, 500),
    [nodes, edges, currentWorkflow, toast]
  );

  useEffect(() => {
    const nodesChanges = nodeChanged && nodes.length;
    const nodeOrEdgeChanged = nodesChanges || edgeChanged;

    if (nodeOrEdgeChanged && !isSaving) debouncedSave();

    return () => {
      debouncedSave.cancel();
    };
  }, [nodes, edges, nodeChanged, isSaving]);

  const onEdgesChangeFlagged = (newEdges: EdgeChange<ReactFlowEdge>[]) => {
    onEdgesChange(newEdges);
    setEdgeChanged(true);
  };

  return (
    <WorkflowContext.Provider
      value={{
        currentWorkflow,
        currentNode,
        nodes,
        edges,
        setNodes,
        onNodesChange: onNodesChangeFlagged,
        onEdgesChange: onEdgesChangeFlagged,
        setEdgeChanged,
        setEdges,
        onSetCurrentNode,
        updateNodeProperty,
        updateUserDataProp,
        addNewUserData,
      }}
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

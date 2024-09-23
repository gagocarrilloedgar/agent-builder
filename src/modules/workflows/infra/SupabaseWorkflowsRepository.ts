// src/services/supabase.ts
import { createClient } from "@supabase/supabase-js";

import { FlowWorkflow, WorkflowsRepository } from "@/modules/workflows/domain";
import { convertKeysToCamelCase } from "@/shared/lib/convertKeysToCamelCase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE_NAME = "agents_0507";

export const createSupabaseWorkflowRepository = (): WorkflowsRepository => {
  return {
    getWorkflow,
    getWorkflows,
    updateWorkflow,
  };
};

export const getWorkflows = async (): Promise<FlowWorkflow[]> => {
  const { data, error } = await supabase.from(TABLE_NAME).select("*");

  if (error) throw error;
  if (!data) return [];

  const converted: FlowWorkflow[] = convertKeysToCamelCase(data);
  return converted;
};

export const getWorkflow = async (
  workflowId: number
): Promise<FlowWorkflow> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", workflowId)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Workflow not found");

  const converted: FlowWorkflow = convertKeysToCamelCase(data);
  return converted;
};

export const updateWorkflow = async (
  workflowId: number,
  data: FlowWorkflow["data"]
) => {
  const updatedNodes = data.nodes.map((node) => {
    const nodeType = node.type === "waypoint" ? "default" : node.type;
    return {
      id: Number(node.id),
      node_type: nodeType,
      node_name: node.nodeName,
      prompt: node.prompt,
      node_enter_condition: node.nodeEnterCondition,
      user_data: node.userData?.map((data) => ({
        name: data.name,
        data_type: data.dataType,
        description: data.description,
      })),
    };
  });

  const updatedEdges = data.edges.map((edge) => ({
    id: Number(edge.id),
    label: edge.label,
    source: Number(edge.source),
    target: Number(edge.target),
  }));

  const updatedData = {
    general_instructions: data.generalInstructions,
    edges: updatedEdges,
    nodes: updatedNodes,
  };

  const res = await supabase
    .from(TABLE_NAME)
    .update({ data: updatedData })
    .eq("id", workflowId);

  return {
    error: Boolean(res.error),
  };
};

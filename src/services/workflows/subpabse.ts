// src/services/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { ReactFlowNode, UIWorkflow } from "./types";

const supabaseUrl = "https://erlpcxikshxtxckucexs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybHBjeGlrc2h4dHhja3VjZXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzkwNTksImV4cCI6MjA0MTAxNTA1OX0.Kb0dwlDOA6JnsiYGY_A4IO8dlonA7xLKMsRTp3RnwBA";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getWorkflows = async (): Promise<UIWorkflow[]> => {
  const { data, error } = await supabase.from("agents_0507").select("*");

  if (error) throw error;
  if (!data) return [];

  const converted = convertKeysToCamelCase(data) as UIWorkflow[];
  return converted;
};

export const saveWorkflow = async (workflow: UIWorkflow): Promise<void> => {
  const { error } = await supabase.from("agents_0507").upsert(workflow);

  if (error) throw error;
};

export const updateWorkflowNodes = async (
  workflowId: number,
  nodes: ReactFlowNode[]
) => {
  const { data: currentData, error: fetchError } = await supabase
    .from("agents_0507")
    .select("data")
    .eq("id", workflowId)
    .single();

  if (fetchError) {
    console.error("Error fetching current data:", fetchError);
    throw fetchError;
  }

  const updatedNodes = nodes.map((node) => {
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

  const updatedData = {
    ...currentData.data,
    nodes: updatedNodes,
  };

  return supabase
    .from("agents_0507")
    .update({ data: updatedData })
    .eq("id", workflowId);
};

// Helper function to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

type AnyObject = { [key: string]: unknown };

function convertKeysToCamelCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    // If it's an array, recursively convert the elements
    return obj.map((item) => convertKeysToCamelCase(item)) as unknown as T;
  } else if (obj !== null && typeof obj === "object") {
    // If it's an object, recursively convert its keys
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      const value = (obj as AnyObject)[key];
      (acc as AnyObject)[camelKey] = convertKeysToCamelCase(value);
      return acc;
    }, {} as AnyObject) as T;
  }

  return obj;
}

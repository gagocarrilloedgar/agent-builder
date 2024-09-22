// src/services/supabase.ts
import { createClient } from "@supabase/supabase-js";
import { Workflow } from "./types";

const supabaseUrl = "https://erlpcxikshxtxckucexs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVybHBjeGlrc2h4dHhja3VjZXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzkwNTksImV4cCI6MjA0MTAxNTA1OX0.Kb0dwlDOA6JnsiYGY_A4IO8dlonA7xLKMsRTp3RnwBA";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getWorkflows = async (): Promise<Workflow[]> => {
  const { data, error } = await supabase.from("agents_0507").select("*");

  if (error) throw error;
  return data as Workflow[];
};

export const saveWorkflow = async (workflow: Workflow): Promise<void> => {
  const { error } = await supabase.from("agents_0507").upsert(workflow);

  if (error) throw error;
};

import { FlowWorkflow } from "./Workflow";

export interface WorkflowsRepository {
  getWorkflows(): Promise<FlowWorkflow[]>;
  getWorkflow(workflowId: number): Promise<FlowWorkflow>;
  updateWorkflow(
    workflowId: number,
    data: FlowWorkflow["data"]
  ): Promise<{ error: boolean }>;
}

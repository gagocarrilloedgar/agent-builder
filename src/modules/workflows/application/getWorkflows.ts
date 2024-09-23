import { FlowWorkflow, WorkflowsRepository } from "../domain";

export function getWorkflows(repo: WorkflowsRepository) {
  return async function (): Promise<FlowWorkflow[]> {
    return repo.getWorkflows();
  };
}

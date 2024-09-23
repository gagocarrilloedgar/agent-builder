import {
  ReactFlowEdge,
  ReactFlowNode,
  WorkflowsRepository,
} from "../domain";

export function updateWorkflow(repo: WorkflowsRepository) {
  return async function (
    workflowId: number,
    nodes?: ReactFlowNode[],
    edges?: ReactFlowEdge[]
  ): Promise<{ error: boolean }> {
    const { data: currentData } = await repo.getWorkflow(workflowId);

    return repo.updateWorkflow(workflowId, {
      generalInstructions: currentData.generalInstructions,
      edges: edges || currentData.edges,
      nodes: nodes || currentData.nodes,
    });
  };
}

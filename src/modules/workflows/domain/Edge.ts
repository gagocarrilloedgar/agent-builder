export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string | null;
  animated: boolean;
}
import { WorkflowsRepository } from "@/modules/workflows/domain/WorkflowsRepository";
import { vi } from "vitest";

const workflow = {
  id: 1,
  data: {
    generalInstructions: "Test instructions 1",
    nodes: [
      {
        id: "node-1",
        type: "start_call",
        nodeName: "Start Call Node",
        position: { x: 100, y: 200 },
        data: { label: "Start Call" },
      },
      {
        id: "node-2",
        type: "end_call",
        nodeName: "End Call Node",
        position: { x: 300, y: 400 },
        data: { label: "End Call" },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        animated: true,
        label: "Start to End",
      },
    ],
  },
};

export const mockedRepository: WorkflowsRepository = {
  getWorkflows: vi.fn().mockResolvedValue([{ ...workflow }]),
  getWorkflow: vi.fn().mockResolvedValue(workflow),
  updateWorkflow: vi.fn().mockResolvedValue({ error: false }),
};

import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WorkflowBuilder from "@/pages/Workflow";
import { ProviderWrapper } from "@/providers";
import { mockedRepository } from "../fixtures/workflowsRepository";

describe("WorkflowBuilder", () => {
  it("renders the WorkflowBuilder correctly", async () => {
    const { getByText } = render(
      <ProviderWrapper repository={mockedRepository}>
        <WorkflowBuilder />
      </ProviderWrapper>
    );

    await waitFor(() => {
      expect(getByText("Add a new node")).toBeInTheDocument();
      expect(getByText("START CALL")).toBeInTheDocument();
    });
  });
});

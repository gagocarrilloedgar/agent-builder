import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { mockReactFlow } from "./pages/fixtures/mockReactFlow";

mockReactFlow();

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

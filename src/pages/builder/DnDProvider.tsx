import { NodeNodeTypes } from "@/modules/workflows/domain";
import { createContext, PropsWithChildren, useContext, useState } from "react";

const DnDContext = createContext<{
  nodeType: NodeNodeTypes;
  setNodeType: (nodeType: NodeNodeTypes) => void;
} | null>(null);

export const DnDProvider = ({ children }: PropsWithChildren) => {
  const [nodeType, setNodeType] = useState<NodeNodeTypes>("waypoint");

  return (
    <DnDContext.Provider value={{ nodeType, setNodeType }}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  const context = useContext(DnDContext);

  if (!context) {
    throw new Error("useDnD must be used within a DnDProvider");
  }

  return context;
};

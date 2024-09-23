import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { NodeNodeTypes } from "@/modules/workflows/domain";
import "@xyflow/react/dist/style.css";
import { PhoneOff, Waypoints } from "lucide-react";

interface NewNodeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleNewNode: (nodeType: NodeNodeTypes) => void;
}

export const NewNodeDialog = ({
  open,
  setOpen,
  handleNewNode,
}: NewNodeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New node</DialogTitle>
          <DialogDescription>
            Select the type of node you want to create
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-2">
          <Button variant="outline" onClick={() => handleNewNode("waypoint")}>
            <Waypoints size="18" className="mr-2" />
            Action
          </Button>
          <Button variant="outline" onClick={() => handleNewNode("end_call")}>
            <PhoneOff size="18" className="mr-2" />
            End call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NodeNodeTypes,
  publicNodeTypes,
  userDataType,
  UserDataType,
} from "@/modules/workflows/domain";
import { useDnD } from "@/pages/Workflow/DragDropProvider";

import { capitalize } from "@/shared/lib/capitalize";
import {
  FoldHorizontal,
  List,
  SquareMousePointer,
  SquareUser,
  UnfoldHorizontal,
  Workflow,
} from "lucide-react";
import { DragEvent, PropsWithChildren, useState } from "react";
import { useCurrentWorkflow } from "./Workflow/useWorkflow";

export function Layout({ children }: PropsWithChildren) {
  const {
    currentNode: selected,
    nodes,
    updateNodeProperty,
    updateUserDataProp,
    addNewUserData,
  } = useCurrentWorkflow();

  const currentNode = nodes.find((node) => node.id === selected?.id);

  const { setNodeType } = useDnD();
  const onDragStart = (
    nodeType: NodeNodeTypes,
    event: DragEvent<HTMLElement> | undefined
  ) => {
    setNodeType(nodeType);
    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      <aside className="w-16 flex-shrink-0 flex flex-col border-r bg-white p-4">
        <div className="border-b pb-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Workflow className="h-5 w-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Playground"
              >
                <SquareMousePointer className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Workflow builder
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Models"
              >
                <List className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Workflows list
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto grid gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
              >
                <SquareUser className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex-grow h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <aside
        className={`${
          expanded && currentNode ? "w-2/5" : "w-96"
        } min-w-[16rem] h-screen p-4 rounded-xl flex-shrink-0 bg-white `}
      >
        {!currentNode && (
          <div className="flex flex-col w-full h-full border rounded-lg p-4 gap-4">
            <section>
              <p className="text-md font-semibold">Add a new node</p>
            </section>
            <p className="text-sm">
              Drag a node type from the list below to add it to the workflow
            </p>
            <Separator />
            {publicNodeTypes.map((type) => (
              <Button
                onDragStart={(event) => onDragStart(type, event)}
                key={type}
                variant="outline"
                draggable
              >
                {type.replace("_", " ").toUpperCase()}
              </Button>
            ))}
          </div>
        )}
        {currentNode && (
          <div className="flex flex-col w-full h-full border rounded-lg py-2 px-4 gap-4">
            <p>
              {nodes.find((node) => node.id === currentNode.id)?.nodeName}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setExpanded((prev) => !prev)}
                    size="icon"
                    variant="outline"
                    className="float-right"
                  >
                    {expanded ? (
                      <FoldHorizontal className="h-4 w-4" />
                    ) : (
                      <UnfoldHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  {expanded ? "Collapse" : "Expand"} edit
                </TooltipContent>
              </Tooltip>
            </p>
            <InputWrapper>
              <Label htmlFor="name">Node name</Label>
              <Input
                value={
                  nodes.find((node) => node.id === currentNode.id)?.nodeName
                }
                onChange={(e) =>
                  updateNodeProperty(currentNode.id, "nodeName")(e.target.value)
                }
                type="text"
                id="node_name"
                placeholder="Enter node name"
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="email">Condition to start</Label>
              <Input
                value={currentNode?.nodeEnterCondition}
                onChange={(e) =>
                  updateNodeProperty(
                    currentNode.id,
                    "nodeEnterCondition"
                  )(e.target.value)
                }
                type="text"
                id="condition"
                placeholder="Enter condition"
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="promt">Prompt</Label>
              <Textarea
                rows={8}
                value={currentNode?.prompt}
                onChange={(e) =>
                  updateNodeProperty(currentNode.id, "prompt")(e.target.value)
                }
                placeholder="Type your prompt here"
                id="prompt"
              />
            </InputWrapper>
            <Separator />
            <div className="flex flex-col gap-4 overflow-auto">
              <section>
                <p className="text-md font-semibold">User data</p>
                <p className="text-sm ">
                  Please define the user data that should be collected at this
                  node
                </p>
              </section>
              <section className="flex flex-col gap-6">
                {currentNode?.userData?.map(
                  ({ name, description, dataType }, index) => (
                    <section
                      key={`${index}-user-data-section`}
                      className="flex flex-col gap-4"
                    >
                      <InputWrapper key={`${index}-name-data-wrapper`}>
                        <Label id={`${index}-name-data-label`}>Name</Label>
                        <Input
                          value={name}
                          onChange={(e) =>
                            updateUserDataProp(
                              currentNode.id,
                              "name",
                              index
                            )(e.target.value)
                          }
                          type="text"
                          id={`${index}-name-data-input`}
                        />
                      </InputWrapper>
                      <InputWrapper
                        key={`${index}-description-user-data-wrapper`}
                      >
                        <Label id={`${index}-description-user-data-label`}>
                          Description of the data property
                        </Label>
                        <Input
                          value={description}
                          onChange={(e) =>
                            updateUserDataProp(
                              currentNode.id,
                              "description",
                              index
                            )(e.target.value)
                          }
                          type="text"
                          id={`${index}-description-data-input`}
                        />
                      </InputWrapper>
                      <Select
                        value={dataType}
                        onValueChange={(e) =>
                          updateUserDataProp(
                            currentNode.id,
                            "dataType",
                            index
                          )(e as UserDataType)
                        }
                        key={`${index}-data-type-select`}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select data type" />
                        </SelectTrigger>
                        <SelectContent>
                          {userDataType.map((type) => (
                            <SelectItem key={type} value={type}>
                              {capitalize(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Separator />
                    </section>
                  )
                )}
              </section>
              <Button
                onClick={addNewUserData}
                variant="outline"
                className="w-full mt-auto"
              >
                Collect new user property
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

const InputWrapper = ({ children }: PropsWithChildren) => (
  <div className="grid items-center gap-1.5">{children}</div>
);

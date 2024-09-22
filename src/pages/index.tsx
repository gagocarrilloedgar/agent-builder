import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDnD } from "@/DnDProvider";
import { NodeNodeTypes, publicNodeTypes } from "@/services/workflows/types";
import {
  Book,
  Bot,
  Code2,
  Settings,
  SquareTerminal,
  SquareUser,
  Workflow,
} from "lucide-react";
import { DragEvent, PropsWithChildren } from "react";
import { useCurrentWorkflow } from "./builder/provider";

export function Layout({ children }: PropsWithChildren) {
  const { currentNode } = useCurrentWorkflow();
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
                <SquareTerminal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Playground
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
                <Bot className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Models
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="API"
              >
                <Code2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              API
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Documentation"
              >
                <Book className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Documentation
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
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

      <aside className="w-80 min-w-[16rem] h-screen flex-shrink-0 bg-white">
        {!currentNode && (
          <div className="flex flex-col w-full h-full border-l p-4 gap-4">
            <p className="text-md font-semibold">Add a new node</p>
            {publicNodeTypes.map((type) => (
              <Button
                onDragStart={(event) => onDragStart(type, event)}
                key={type}
                variant="outline"
                draggable
                className="flex items-center gap-2"
              >
                {type.replace("_", " ").toUpperCase()}
              </Button>
            ))}
          </div>
        )}
        {currentNode && (
          <div className="flex flex-col w-full h-full border-l py-2 px-4 gap-4">
            <p>{currentNode?.nodeName}</p>
            <InputWrapper>
              <Label htmlFor="name">Node name</Label>
              <Input
                value={currentNode?.nodeName}
                type="text"
                id="node_name"
                placeholder="Enter node name"
              />
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="email">Condition to start</Label>
              <Input
                value={currentNode?.nodeEnterCondition}
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
                placeholder="Type your prompt here"
                id="prompt"
              />
            </InputWrapper>
            <Separator />
            <p className="text-md font-semibold">User data</p>
            <p className="text-sm ">
              Please define the user data that should be collected at this node
            </p>
            {currentNode?.userData?.map((value, index) => (
              <InputWrapper key={index.toString()}>
                <Label id={`${index}-${value}`}>{value.description}</Label>
                <Input
                  value={value.name}
                  type="text"
                  id={`${index}-${value}`}
                />
              </InputWrapper>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

const InputWrapper = ({ children }: PropsWithChildren) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">{children}</div>
);

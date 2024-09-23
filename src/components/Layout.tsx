import { PropsWithChildren } from "react";

import { List, SquareMousePointer, SquareUser, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function Layout({ children }: PropsWithChildren) {
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
      {children}
    </div>
  );
}

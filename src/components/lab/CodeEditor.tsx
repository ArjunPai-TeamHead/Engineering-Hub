import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Code, FileCode } from "lucide-react";

interface Props {
  code: string;
  setCode: (code: string) => void;
  language: "cpp" | "python";
  setLanguage: (l: "cpp" | "python") => void;
}

export function CodeEditor({ code, setCode, language, setLanguage }: Props) {
  const lines = code.split("\n");

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Code Editor</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant={language === "cpp" ? "default" : "ghost"}
            size="sm" className="h-6 text-[10px] px-2"
            onClick={() => setLanguage("cpp")}
          >
            <FileCode className="h-3 w-3 mr-0.5" /> C++
          </Button>
          <Button
            variant={language === "python" ? "default" : "ghost"}
            size="sm" className="h-6 text-[10px] px-2"
            onClick={() => setLanguage("python")}
          >
            <FileCode className="h-3 w-3 mr-0.5" /> Python
          </Button>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex min-h-full">
            {/* Line numbers */}
            <div className="select-none border-r border-border bg-muted/30 px-2 pt-2 text-right font-mono text-[11px] text-muted-foreground/50 leading-5">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full min-h-full resize-none bg-transparent p-2 font-mono text-[12px] text-foreground leading-5 outline-none"
              style={{ tabSize: 2 }}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

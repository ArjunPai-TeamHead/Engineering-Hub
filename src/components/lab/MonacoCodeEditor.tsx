import { useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface Props {
  code: string;
  setCode: (code: string) => void;
  language: "cpp" | "python";
}

export function MonacoCodeEditor({ code, setCode, language }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleMount = useCallback((editor: any, monaco: any) => {
    // Register Arduino/C++ snippets
    monaco.languages.registerCompletionItemProvider("cpp", {
      provideCompletionItems: () => ({
        suggestions: [
          { label: "digitalWrite", kind: monaco.languages.CompletionItemKind.Function, insertText: "digitalWrite(${1:pin}, ${2:value});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Write HIGH or LOW to a digital pin" },
          { label: "digitalRead", kind: monaco.languages.CompletionItemKind.Function, insertText: "digitalRead(${1:pin})", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Read digital pin state" },
          { label: "analogRead", kind: monaco.languages.CompletionItemKind.Function, insertText: "analogRead(${1:pin})", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Read analog value (0-1023)" },
          { label: "analogWrite", kind: monaco.languages.CompletionItemKind.Function, insertText: "analogWrite(${1:pin}, ${2:value});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Write PWM value (0-255)" },
          { label: "pinMode", kind: monaco.languages.CompletionItemKind.Function, insertText: "pinMode(${1:pin}, ${2:mode});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Set pin mode (INPUT/OUTPUT)" },
          { label: "Serial.begin", kind: monaco.languages.CompletionItemKind.Function, insertText: "Serial.begin(${1:9600});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Initialize serial at baud rate" },
          { label: "Serial.println", kind: monaco.languages.CompletionItemKind.Function, insertText: "Serial.println(${1:value});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Print with newline" },
          { label: "delay", kind: monaco.languages.CompletionItemKind.Function, insertText: "delay(${1:1000});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Pause for milliseconds" },
          { label: "millis", kind: monaco.languages.CompletionItemKind.Function, insertText: "millis()", documentation: "Milliseconds since start" },
          { label: "setup", kind: monaco.languages.CompletionItemKind.Snippet, insertText: "void setup() {\n  ${1}\n}", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Setup function" },
          { label: "loop", kind: monaco.languages.CompletionItemKind.Snippet, insertText: "void loop() {\n  ${1}\n}", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: "Loop function" },
        ],
      }),
    });

    editor.focus();
  }, []);

  return (
    <Editor
      height="100%"
      language={language === "cpp" ? "cpp" : "python"}
      theme={isDark ? "vs-dark" : "vs"}
      value={code}
      onChange={(v) => setCode(v || "")}
      onMount={handleMount}
      options={{
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: "all",
        lineNumbers: "on",
        tabSize: 2,
        automaticLayout: true,
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        wordWrap: "on",
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        padding: { top: 8 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
      }}
    />
  );
}

import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";

// Simple markdown-like renderer
const renderContent = (content: string) => {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={i} className="my-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm text-foreground">
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        codeLang = line.slice(3);
        inCodeBlock = true;
      }
      return;
    }
    if (inCodeBlock) { codeLines.push(line); return; }
    if (line.startsWith("# ")) { elements.push(<h1 key={i} className="mb-4 mt-6 text-2xl font-bold text-foreground">{line.slice(2)}</h1>); return; }
    if (line.startsWith("## ")) { elements.push(<h2 key={i} className="mb-3 mt-5 text-xl font-semibold text-foreground">{line.slice(3)}</h2>); return; }
    if (line.startsWith("- **")) {
      const match = line.match(/^- \*\*(.+?)\*\*[: ]*(.*)$/);
      if (match) { elements.push(<li key={i} className="ml-4 mb-1 text-sm text-foreground"><strong>{match[1]}</strong>: {match[2]}</li>); return; }
    }
    if (line.startsWith("- ")) { elements.push(<li key={i} className="ml-4 mb-1 text-sm text-foreground">{line.slice(2)}</li>); return; }
    if (line.match(/^\d+\.\s/)) { elements.push(<li key={i} className="ml-4 mb-1 list-decimal text-sm text-foreground">{line.replace(/^\d+\.\s/, "")}</li>); return; }
    if (line.trim() === "") { elements.push(<div key={i} className="h-2" />); return; }
    elements.push(<p key={i} className="mb-2 text-sm leading-relaxed text-muted-foreground">{line}</p>);
  });

  return elements;
};

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();

  let lesson = null;
  let course = null;
  for (const c of courses) {
    const l = c.lessons.find((l) => l.id === id);
    if (l) { lesson = l; course = c; break; }
  }

  if (!lesson || !course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Button variant="outline" asChild><Link to="/academy"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
      </div>
    );
  }

  const lessonIdx = course.lessons.findIndex((l) => l.id === id);
  const prev = lessonIdx > 0 ? course.lessons[lessonIdx - 1] : null;
  const next = lessonIdx < course.lessons.length - 1 ? course.lessons[lessonIdx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to={`/academy/course/${course.id}`}><ArrowLeft className="mr-2 h-4 w-4" />{course.title}</Link>
      </Button>

      <article className="prose-sm">
        {renderContent(lesson.content)}
      </article>

      <div className="mt-8 flex justify-between">
        {prev ? (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/academy/lesson/${prev.id}`}>← {prev.title}</Link>
          </Button>
        ) : <div />}
        {next ? (
          <Button size="sm" asChild>
            <Link to={`/academy/lesson/${next.id}`}>{next.title} →</Link>
          </Button>
        ) : <div />}
      </div>
    </div>
  );
};

export default LessonPage;

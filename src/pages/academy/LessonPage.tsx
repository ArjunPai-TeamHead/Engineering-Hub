import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { courses, QuizQuestion } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const renderContent = (content: string) => {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

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
        inCodeBlock = true;
      }
      return;
    }
    if (inCodeBlock) { codeLines.push(line); return; }
    if (line.startsWith("# ")) { elements.push(<h1 key={i} className="mb-4 mt-6 text-2xl font-bold text-foreground">{line.slice(2)}</h1>); return; }
    if (line.startsWith("## ")) { elements.push(<h2 key={i} className="mb-3 mt-5 text-xl font-semibold text-foreground">{line.slice(3)}</h2>); return; }
    if (line.startsWith("### ")) { elements.push(<h3 key={i} className="mb-2 mt-4 text-lg font-semibold text-foreground">{line.slice(4)}</h3>); return; }
    if (line.startsWith("---")) { elements.push(<hr key={i} className="my-6 border-border" />); return; }
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

const QuizSection = ({ quiz, onComplete }: { quiz: QuizQuestion[]; onComplete: () => void }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = quiz.reduce((acc, q, i) => {
    return acc + (answers[i] === String(q.correctIndex) ? 1 : 0);
  }, 0);

  const handleSubmit = () => {
    setSubmitted(true);
    if (score === quiz.length) {
      onComplete();
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <Trophy className="h-5 w-5 text-amber" /> Lesson Quiz
      </h2>

      {quiz.map((q, i) => (
        <Card key={i} className={submitted ? (answers[i] === String(q.correctIndex) ? "border-primary/50" : "border-destructive/50") : ""}>
          <CardContent className="pt-4">
            <p className="mb-3 text-sm font-medium text-foreground">{i + 1}. {q.question}</p>
            <RadioGroup
              value={answers[i] ?? ""}
              onValueChange={(v) => !submitted && setAnswers({ ...answers, [i]: v })}
              disabled={submitted}
            >
              {q.options.map((opt, j) => (
                <div key={j} className="flex items-center gap-2">
                  <RadioGroupItem value={String(j)} id={`q${i}-o${j}`} />
                  <Label htmlFor={`q${i}-o${j}`} className={`text-sm cursor-pointer ${
                    submitted && j === q.correctIndex ? "text-primary font-semibold" :
                    submitted && answers[i] === String(j) && j !== q.correctIndex ? "text-destructive line-through" : ""
                  }`}>
                    {opt}
                    {submitted && j === q.correctIndex && <CheckCircle2 className="inline ml-1 h-3.5 w-3.5 text-primary" />}
                    {submitted && answers[i] === String(j) && j !== q.correctIndex && <XCircle className="inline ml-1 h-3.5 w-3.5 text-destructive" />}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      {!submitted ? (
        <Button onClick={handleSubmit} disabled={Object.keys(answers).length < quiz.length}>
          Submit Answers
        </Button>
      ) : (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-foreground">
              Score: {score}/{quiz.length} {score === quiz.length ? "🎉 Perfect!" : score >= quiz.length / 2 ? "👍 Good job!" : "📚 Review and try again!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  let lesson = null;
  let course = null;
  for (const c of courses) {
    const l = c.lessons.find((l) => l.id === id);
    if (l) { lesson = l; course = c; break; }
  }

  useEffect(() => {
    if (!user || !lesson || !course) return;
    supabase
      .from("course_progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .eq("course_id", course.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.completed) setCompleted(true);
      });
  }, [user, lesson?.id, course?.id]);

  const markComplete = async () => {
    if (!user || !lesson || !course) {
      toast.error("Please sign in to track progress.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("course_progress").upsert({
      user_id: user.id,
      course_id: course.id,
      lesson_id: lesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,course_id,lesson_id" });

    if (error) {
      // If conflict upsert fails, try insert
      await supabase.from("course_progress").insert({
        user_id: user.id,
        course_id: course.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }
    setCompleted(true);
    setLoading(false);
    toast.success("Lesson marked as complete! 🎉");
  };

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

      {lesson.quiz && lesson.quiz.length > 0 && (
        <QuizSection quiz={lesson.quiz} onComplete={markComplete} />
      )}

      <div className="mt-6">
        {completed ? (
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <CheckCircle2 className="h-5 w-5" /> Lesson Complete
          </div>
        ) : (
          <Button onClick={markComplete} disabled={loading} variant="outline" size="sm">
            {loading ? "Saving..." : "Mark as Complete"}
          </Button>
        )}
      </div>

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

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Send, Loader2, Upload, Camera, BrainCircuit, ListChecks, Bot, ChevronLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/courses";
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

// AI Sidebar helper
const AISidebar = ({ lessonTitle, lessonContent }: { lessonTitle: string; lessonContent: string }) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input.trim() };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setLoading(true);

    let assistantContent = "";

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) { setMessages(prev => [...prev, { role: "assistant", content: "Please sign in to use the AI helper." }]); setLoading(false); return; }

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/academy-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: allMsgs, lessonTitle, lessonContext: lessonContent.slice(0, 2000) }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        setMessages(prev => [...prev, { role: "assistant", content: err.error || "Something went wrong." }]);
        setLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const chunk = JSON.parse(json).choices?.[0]?.delta?.content;
            if (chunk) {
              assistantContent += chunk;
              setMessages(prev => {
                const u = [...prev];
                u[u.length - 1] = { role: "assistant", content: assistantContent };
                return u;
              });
            }
          } catch { buffer = line + "\n" + buffer; break; }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-border">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <BrainCircuit className="h-4 w-4 text-violet-500" />
        <span className="text-sm font-semibold text-foreground">AI Helper</span>
        <Badge variant="outline" className="text-[10px] ml-auto">Live</Badge>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-xs text-muted-foreground mt-8 px-4">
            <p className="mb-2">Ask me anything about this lesson!</p>
            <p className="text-[10px]">e.g. "Explain how pull-up resistors work" or "What pin should I connect the LED to?"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`text-xs leading-relaxed rounded-lg p-2.5 ${m.role === "user" ? "bg-primary/10 text-foreground ml-4" : "bg-muted text-foreground mr-4"}`}>
            {m.content || (loading && i === messages.length - 1 ? <Loader2 className="h-3 w-3 animate-spin" /> : null)}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          className="text-xs h-8"
          disabled={loading}
        />
        <Button size="icon" className="h-8 w-8 shrink-0" onClick={send} disabled={loading || !input.trim()}>
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
};

// Photo upload grading
const PhotoGrading = ({ lessonId, courseId, onGraded }: { lessonId: string; courseId: string; onGraded: (grade: string) => void }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<{ grade: string; feedback: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    // Upload to storage
    const path = `${user.id}/academy/${courseId}/${lessonId}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("user-files").upload(path, file);
    if (upErr) { toast.error("Upload failed"); setUploading(false); return; }

    // Get signed URL for AI grading
    const { data: urlData } = await supabase.storage.from("user-files").createSignedUrl(path, 3600);
    if (!urlData?.signedUrl) { toast.error("Could not get file URL"); setUploading(false); return; }

    setUploading(false);
    setGrading(true);

    // Call AI grading
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/academy-grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl: urlData.signedUrl, lessonId, courseId }),
      });
      const data = await resp.json();
      if (data.grade) {
        setResult({ grade: data.grade, feedback: data.feedback });
        if (data.grade === "Excellent" || data.grade === "Good") {
          onGraded(data.grade);
        }
      } else {
        setResult({ grade: "Error", feedback: data.error || "Could not grade. Try again." });
      }
    } catch {
      setResult({ grade: "Error", feedback: "Connection error. Please try again." });
    } finally {
      setGrading(false);
    }
  };

  const gradeColor: Record<string, string> = {
    Excellent: "text-green-500 border-green-500/30 bg-green-500/10",
    Good: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    Wrong: "text-red-500 border-red-500/30 bg-red-500/10",
    Poor: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    Error: "text-muted-foreground border-border bg-muted",
  };

  return (
    <Card className="mt-6 border-violet-500/20">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold text-foreground">Submit Your Result</span>
        </div>
        <p className="text-xs text-muted-foreground">Upload a photo of your completed project and the AI will grade your work.</p>

        {result ? (
          <div className={`rounded-lg border p-4 ${gradeColor[result.grade] || gradeColor.Error}`}>
            <p className="text-sm font-bold mb-1">Grade: {result.grade}</p>
            <p className="text-xs leading-relaxed">{result.feedback}</p>
            <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => { setResult(null); fileRef.current!.value = ""; }}>
              Upload Again
            </Button>
          </div>
        ) : (
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => fileRef.current?.click()} disabled={uploading || grading}>
              {uploading ? <><Loader2 className="h-3 w-3 animate-spin" /> Uploading...</> :
               grading ? <><Loader2 className="h-3 w-3 animate-spin" /> AI is grading...</> :
               <><Upload className="h-3 w-3" /> Upload Photo</>}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [curriculumOpen, setCurriculumOpen] = useState(true);

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
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("completed", true)
      .then(({ data }) => {
        if (!data) return;
        const set = new Set(data.map((d) => d.lesson_id));
        setCompletedLessons(set);
        if (set.has(lesson.id)) setCompleted(true);
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
      await supabase.from("course_progress").insert({
        user_id: user.id,
        course_id: course.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }
    setCompleted(true);
    setCompletedLessons((prev) => new Set(prev).add(lesson!.id));
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
  const courseProgress = Math.round((completedLessons.size / course.lessons.length) * 100);

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Curriculum sidebar (Udemy-style) */}
      {curriculumOpen && (
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-border bg-card/30">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <ListChecks className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground truncate">Course content</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurriculumOpen(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-4 py-2 border-b border-border">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span className="truncate pr-2">{course.title}</span>
              <span>{completedLessons.size}/{course.lessons.length}</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${courseProgress}%` }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {course.lessons.map((l, i) => {
              const isDone = completedLessons.has(l.id);
              const isActive = l.id === lesson!.id;
              return (
                <Link
                  key={l.id}
                  to={`/academy/lesson/${l.id}`}
                  className={`flex items-start gap-2 rounded-lg px-2 py-2 text-xs transition-colors ${
                    isActive ? "bg-primary/15 text-foreground" : "hover:bg-muted/60 text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  ) : (
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold mt-0.5 ${
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>{i + 1}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`leading-snug ${isActive ? "font-semibold text-foreground" : ""}`}>{l.title}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{l.duration}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 min-w-0">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {!curriculumOpen && (
              <Button variant="outline" size="sm" onClick={() => setCurriculumOpen(true)} className="gap-1.5 rounded-full">
                <ListChecks className="h-4 w-4" /> Curriculum
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/academy/course/${course.id}`}><ArrowLeft className="mr-2 h-4 w-4" />{course.title}</Link>
            </Button>
            <Badge variant="outline" className="ml-auto rounded-full text-[10px]">Lesson {lessonIdx + 1} / {course.lessons.length}</Badge>
          </div>

          {/* Mobile tabs: content vs AI */}
          <div className="lg:hidden mb-4">
            <Tabs defaultValue="content">
              <TabsList className="rounded-full">
                <TabsTrigger value="content" className="rounded-full text-xs"><BrainCircuit className="h-3 w-3 mr-1" />Content</TabsTrigger>
                <TabsTrigger value="ai" className="rounded-full text-xs"><Bot className="h-3 w-3 mr-1" />AI Helper</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <article className="prose-sm">{renderContent(lesson.content)}</article>
              </TabsContent>
              <TabsContent value="ai" className="mt-4 h-[60vh]">
                <AISidebar lessonTitle={lesson.title} lessonContent={lesson.content} />
              </TabsContent>
            </Tabs>
          </div>

          <article className="prose-sm hidden lg:block">{renderContent(lesson.content)}</article>

          {/* Photo grading replaces quizzes */}
          <PhotoGrading
            key={lesson.id}
            lessonId={lesson.id}
            courseId={course.id}
            onGraded={() => markComplete()}
          />

          <div className="mt-6">
            {completed ? (
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <CheckCircle2 className="h-5 w-5" /> Lesson Complete
              </div>
            ) : (
              <Button onClick={markComplete} disabled={loading} variant="outline" size="sm" className="rounded-full">
                {loading ? "Saving..." : "Mark as Complete"}
              </Button>
            )}
          </div>

          <div className="mt-8 flex justify-between pb-8 gap-2">
            {prev ? (
              <Button variant="outline" size="sm" asChild className="rounded-full">
                <Link to={`/academy/lesson/${prev.id}`}>← {prev.title}</Link>
              </Button>
            ) : <div />}
            {next ? (
              <Button size="sm" asChild className="rounded-full">
                <Link to={`/academy/lesson/${next.id}`}>{next.title} →</Link>
              </Button>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* AI Sidebar (desktop) */}
      <div className="hidden lg:flex w-80 shrink-0">
        <AISidebar lessonTitle={lesson.title} lessonContent={lesson.content} />
      </div>
    </div>
  );
};

export default LessonPage;

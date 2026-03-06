import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const course = courses.find((c) => c.id === id);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || !course) return;
    supabase
      .from("course_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("completed", true)
      .then(({ data }) => {
        if (data) {
          setCompletedLessons(new Set(data.map((d) => d.lesson_id)));
        }
      });
  }, [user, course?.id]);

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Course not found.</p>
        <Button variant="outline" asChild><Link to="/academy"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
      </div>
    );
  }

  const progress = course.lessons.length > 0 ? Math.round((completedLessons.size / course.lessons.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/academy"><ArrowLeft className="mr-2 h-4 w-4" />All Courses</Link>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
        <p className="mt-1 text-muted-foreground">{course.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="outline">{course.path} Path</Badge>
        </div>
      </div>

      {user && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-muted-foreground">{completedLessons.size}/{course.lessons.length} lessons</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
        <BookOpen className="h-5 w-5 text-primary" /> Lessons
      </h2>

      <div className="space-y-2">
        {course.lessons.map((lesson, i) => {
          const isComplete = completedLessons.has(lesson.id);
          return (
            <Link key={lesson.id} to={`/academy/lesson/${lesson.id}`}>
              <Card className={`group cursor-pointer transition-all hover:border-primary/40 ${isComplete ? "border-primary/20 bg-primary/5" : ""}`}>
                <CardContent className="flex items-center gap-4 py-4">
                  {isComplete ? (
                    <CheckCircle2 className="h-8 w-8 shrink-0 text-primary" />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {lesson.duration}
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <span className="ml-2 text-primary">• {lesson.quiz.length} quiz questions</span>
                      )}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CoursePage;

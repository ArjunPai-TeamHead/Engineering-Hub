import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { courses } from "@/data/courses";

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Course not found.</p>
        <Button variant="outline" asChild><Link to="/academy"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
      </div>
    );
  }

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

      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
        <BookOpen className="h-5 w-5 text-primary" /> Lessons
      </h2>

      <div className="space-y-2">
        {course.lessons.map((lesson, i) => (
          <Link key={lesson.id} to={`/academy/lesson/${lesson.id}`}>
            <Card className="group cursor-pointer transition-all hover:border-primary/40">
              <CardContent className="flex items-center gap-4 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {lesson.duration}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;

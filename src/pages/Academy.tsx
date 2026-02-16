import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Trophy, Zap, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courses, skillPaths } from "@/data/courses";

const levelColor: Record<string, string> = {
  Beginner: "border-primary/40 text-primary",
  Intermediate: "border-accent/40 text-accent",
  Advanced: "border-rose/40 text-rose",
};

const Academy = () => (
  <div className="mx-auto max-w-6xl p-6">
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg bg-violet/10 p-2" style={{ boxShadow: "0 0 20px hsl(265 83% 57% / 0.3)" }}>
          <GraduationCap className="h-6 w-6 text-violet" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">The Academy</h1>
          <p className="text-muted-foreground">Interactive courses for IoT, Robotics, and AI</p>
        </div>
      </div>
    </div>

    {/* Skill Paths */}
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber" /> Skill Paths
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {skillPaths.map((path, i) => (
          <motion.div key={path.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-l-4" style={{ borderLeftColor: path.color }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{path.name}</CardTitle>
                <CardDescription>{path.courses.length} courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {path.courses.map((cId, j) => (
                    <div key={cId} className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full border-2" style={{ borderColor: path.color, backgroundColor: "transparent" }} />
                      {j < path.courses.length - 1 && <div className="h-px w-6" style={{ backgroundColor: path.color, opacity: 0.3 }} />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Course Catalog */}
    <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-primary" /> All Courses
    </h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => (
        <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Link to={`/academy/course/${course.id}`}>
            <Card className="group h-full cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{course.description}</CardDescription>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className={levelColor[course.level]}>{course.level}</Badge>
                  <Badge variant="outline">{course.path}</Badge>
                  <span className="text-xs text-muted-foreground">{course.lessons.length} lessons</span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>

    {/* Daily Challenge Placeholder */}
    <Card className="mt-8 border-amber/30 bg-amber/5">
      <CardHeader className="flex flex-row items-center gap-4">
        <Zap className="h-8 w-8 text-amber" />
        <div>
          <CardTitle className="text-base">Daily Challenge</CardTitle>
          <CardDescription>Fix the Bug — A new circuit debugging puzzle every day. Coming soon!</CardDescription>
        </div>
      </CardHeader>
    </Card>
  </div>
);

export default Academy;

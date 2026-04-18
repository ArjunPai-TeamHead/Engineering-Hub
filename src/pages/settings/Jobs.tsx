import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Wifi, ArrowRight, Loader2, Building2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salary_range: string;
  work_mode: string;
  location: string | null;
  employment_type: string;
  is_open: boolean;
}

const workModeColor: Record<string, string> = {
  remote: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  office: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  hybrid: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("jobs").select("*").eq("is_open", true).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setJobs(data as Job[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-3 rounded-full">
        <Link to="/settings"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Settings</Link>
      </Button>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-orange-500/10 p-2.5">
          <Briefcase className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Open Positions</h1>
          <p className="text-muted-foreground">Join the team building EngiNexus</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : jobs.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No open positions right now. Check back later!</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <Link key={job.id} to={`/settings/jobs/${job.id}`}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                        <Badge variant="outline" className="text-[10px] rounded-full">{job.department}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="outline" className={`rounded-full ${workModeColor[job.work_mode]}`}>
                          {job.work_mode === "remote" ? <Wifi className="h-3 w-3 mr-1" /> : <Building2 className="h-3 w-3 mr-1" />}
                          {job.work_mode}
                        </Badge>
                        {job.location && (
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                        )}
                        <span>•</span>
                        <span className="font-medium text-foreground">{job.salary_range}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;

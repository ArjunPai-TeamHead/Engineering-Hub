import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Wifi, Building2, Loader2, CheckCircle2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_letter: "",
    experience_years: 0,
    current_company: "",
    linkedin_url: "",
    resume_url: "",
    resume_name: "",
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("jobs").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) setJob(data as Job);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (profile && user) {
      setForm(f => ({ ...f, full_name: profile.display_name || "", email: user.email || "" }));
    }
  }, [profile, user]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Resume must be under 10MB.", variant: "destructive" });
      return;
    }
    setUploadingResume(true);
    const ext = file.name.split(".").pop() || "pdf";
    const path = `${user.id}/resumes/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("user-files").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploadingResume(false);
      return;
    }
    setForm(f => ({ ...f, resume_url: path, resume_name: file.name }));
    toast({ title: "Resume uploaded!" });
    setUploadingResume(false);
  };

  const submitApplication = async () => {
    if (!user || !job) return;
    if (!form.full_name || !form.email || !form.phone || !form.resume_url) {
      toast({ title: "Required fields missing", description: "Please fill in all required fields and upload your resume.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      job_id: job.id,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      cover_letter: form.cover_letter,
      resume_url: form.resume_url,
      experience_years: form.experience_years,
      current_company: form.current_company,
      linkedin_url: form.linkedin_url,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Job not found.</p>
        <Button variant="outline" asChild className="rounded-full"><Link to="/settings/jobs"><ArrowLeft className="mr-1 h-4 w-4" />Back</Link></Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Application submitted!</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Your application for <strong>{job.title}</strong> has been acknowledged. We'll review it and reach out to you soon.
            </p>
            <Button asChild className="rounded-xl"><Link to="/settings/jobs">Browse more jobs</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-3 rounded-full">
        <Link to="/settings/jobs"><ArrowLeft className="mr-1 h-4 w-4" /> All jobs</Link>
      </Button>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-2xl bg-orange-500/10 p-2.5">
              <Briefcase className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
              <div className="flex items-center gap-2 flex-wrap mt-1.5">
                <Badge variant="outline" className="rounded-full">{job.department}</Badge>
                <Badge variant="outline" className="rounded-full">{job.employment_type}</Badge>
                <Badge variant="outline" className="rounded-full">
                  {job.work_mode === "remote" ? <Wifi className="h-3 w-3 mr-1" /> : <Building2 className="h-3 w-3 mr-1" />}
                  {job.work_mode}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Salary</p>
              <p className="text-sm font-semibold text-foreground">{job.salary_range}</p>
            </div>
            {job.location && (
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</p>
                <p className="text-sm font-semibold text-foreground">{job.location}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground mb-2">About the role</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-semibold text-foreground mb-2">Requirements</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.requirements}</p>
          </div>

          {!showApply && (
            <Button onClick={() => {
              if (!user) { navigate("/signin"); return; }
              setShowApply(true);
            }} className="rounded-xl w-full">Apply for this Job</Button>
          )}
        </CardContent>
      </Card>

      {showApply && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Application form</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone *</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Years of Experience</Label>
                  <Input type="number" min={0} value={form.experience_years} onChange={e => setForm({ ...form, experience_years: parseInt(e.target.value) || 0 })} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Current Company</Label>
                  <Input value={form.current_company} onChange={e => setForm({ ...form, current_company: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">LinkedIn URL</Label>
                  <Input value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cover Letter</Label>
                <Textarea value={form.cover_letter} onChange={e => setForm({ ...form, cover_letter: e.target.value })} placeholder="Why do you want this role?" className="min-h-24 rounded-xl" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Resume * (PDF, DOC, DOCX — max 10MB)</Label>
                <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                {form.resume_url ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex items-center justify-between">
                    <p className="text-xs text-emerald-500 truncate"><CheckCircle2 className="h-3 w-3 inline mr-1" /> {form.resume_name}</p>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => resumeInputRef.current?.click()}>Replace</Button>
                  </div>
                ) : (
                  <Button variant="outline" className="rounded-xl gap-2 w-full" onClick={() => resumeInputRef.current?.click()} disabled={uploadingResume}>
                    {uploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploadingResume ? "Uploading..." : "Upload Resume"}
                  </Button>
                )}
              </div>

              <Button onClick={submitApplication} disabled={submitting || !form.resume_url} className="rounded-xl w-full">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetail;

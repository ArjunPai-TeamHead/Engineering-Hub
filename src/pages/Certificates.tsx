import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.jpeg";

interface Certificate {
  id: string;
  course_id: string;
  course_title: string;
  awarded_at: string;
}

const Certificates = () => {
  const { user, profile } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("certificates")
      .select("*")
      .eq("user_id", user.id)
      .order("awarded_at", { ascending: false })
      .then(({ data }) => {
        if (data) setCerts(data as Certificate[]);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-muted-foreground">Please sign in to view your certificates.</p>
        <Button asChild className="mt-4"><Link to="/signin">Sign In</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-2xl bg-amber/10 p-3 glow-accent">
          <Award className="h-7 w-7 text-amber" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground">Badges earned by completing courses</p>
        </div>
      </div>

      {certs.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Award className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">No certificates yet</p>
            <p className="text-sm text-muted-foreground/70 mb-4">Complete all lessons in a course to earn your badge!</p>
            <Button variant="outline" asChild><Link to="/academy">Browse Courses</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {certs.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="bg-gradient-to-br from-amber/20 via-primary/10 to-violet/20 p-8 text-center relative">
                <div className="absolute top-3 right-3 rounded-full bg-amber/20 p-1.5">
                  <Award className="h-4 w-4 text-amber" />
                </div>
                <img src={logoImg} alt="Logo" className="h-16 w-16 rounded-2xl object-cover mx-auto mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-1">Certificate of Completion</h3>
                <p className="text-xs text-muted-foreground mb-3">Awarded to</p>
                <p className="text-base font-semibold text-foreground">{profile?.display_name || "Engineer"}</p>
              </div>
              <CardContent className="pt-4 pb-5">
                <p className="text-sm font-medium text-foreground mb-1">{cert.course_title}</p>
                <p className="text-xs text-muted-foreground">
                  Earned on {new Date(cert.awarded_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;

import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Cpu, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { components } from "@/data/componentLibrary";

const ComponentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const comp = components.find((c) => c.id === id);

  if (!comp) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Component not found.</p>
        <Button variant="outline" asChild><Link to="/lab"><ArrowLeft className="mr-2 h-4 w-4" />Back to Library</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/lab"><ArrowLeft className="mr-2 h-4 w-4" />Back to Library</Link>
      </Button>

      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-xl border border-border bg-card p-4 glow-primary">
          <Cpu className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{comp.name}</h1>
          <p className="mt-1 text-muted-foreground">{comp.description}</p>
          <Badge variant="outline" className="mt-2">{comp.category}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Specifications */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Specifications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(comp.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-mono text-foreground">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pinout */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Pinout</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {comp.pins.map((pin) => (
                <span key={pin} className="rounded-md border border-primary/30 bg-primary/5 px-2 py-1 font-mono text-xs text-primary">
                  {pin}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future simulator integration */}
      <Card className="mt-4 border-dashed">
        <CardContent className="flex items-center justify-center py-12 text-center">
          <div>
            <Cpu className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">Interactive Simulation</p>
            <p className="text-xs text-muted-foreground/70">Drag this component onto the virtual breadboard — coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentDetail;

import { Wifi, Activity, Gauge, ToggleLeft, Thermometer, Download, QrCode } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const gridFeatures = [
  { icon: Activity, title: "Web Serial API", description: "Read USB Arduino data directly in the browser", status: "Ready" },
  { icon: Gauge, title: "Browser Oscilloscope", description: "Graph real voltage data from USB-connected hardware", status: "Coming Soon" },
  { icon: Wifi, title: "Cloud MQTT Broker", description: "Free MQTT endpoint for your IoT devices", status: "Coming Soon" },
  { icon: ToggleLeft, title: "IoT Dashboard", description: "Drag-and-drop widgets — gauges, sliders, switches", status: "Coming Soon" },
  { icon: Download, title: "Data Logger", description: "Save sensor data to CSV/Excel", status: "Ready" },
  { icon: QrCode, title: "QR Code Generator", description: "Link physical devices to project pages", status: "Ready" },
];

// Simple mock dashboard
const mockSensors = [
  { label: "Temperature", value: "23.4°C", icon: Thermometer },
  { label: "Humidity", value: "58%", icon: Gauge },
  { label: "Light", value: "742 lux", icon: Activity },
];

const Grid = () => (
  <div className="mx-auto max-w-6xl p-6">
    <div className="mb-6 flex items-center gap-3">
      <div className="rounded-lg bg-violet/10 p-2" style={{ boxShadow: "0 0 20px hsl(265 83% 57% / 0.3)" }}>
        <Wifi className="h-6 w-6 text-violet" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">The Grid</h1>
        <p className="text-muted-foreground">IoT bridge — connect your browser to real hardware</p>
      </div>
    </div>

    {/* Mock Dashboard */}
    <Card className="mb-8 border-violet/20">
      <CardHeader>
        <CardTitle className="text-base">Live Dashboard Preview</CardTitle>
        <CardDescription>Connect a device to see real data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {mockSensors.map((sensor) => (
            <div key={sensor.label} className="rounded-lg border border-border bg-muted/50 p-4 text-center">
              <sensor.icon className="mx-auto mb-2 h-6 w-6 text-violet" />
              <p className="text-2xl font-bold font-mono text-foreground">{sensor.value}</p>
              <p className="text-xs text-muted-foreground">{sensor.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="text-xs">Connect USB Device</Button>
          <Button size="sm" variant="outline" className="text-xs">Export CSV</Button>
        </div>
      </CardContent>
    </Card>

    {/* Features */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {gridFeatures.map((feat) => (
        <Card key={feat.title}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="rounded-lg bg-violet/10 p-2.5"><feat.icon className="h-5 w-5 text-violet" /></div>
            <div className="flex-1">
              <CardTitle className="text-sm">{feat.title}</CardTitle>
              <CardDescription className="text-xs">{feat.description}</CardDescription>
            </div>
            <Badge variant="outline" className={feat.status === "Ready" ? "border-primary/40 text-primary" : "border-muted-foreground/30 text-muted-foreground"}>
              {feat.status}
            </Badge>
          </CardHeader>
        </Card>
      ))}
    </div>
  </div>
);

export default Grid;

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const boards = [
  { name: "Arduino Uno R3", width: "68.6mm", height: "53.4mm", holes: "4x M3 (3.2mm)", spacing: "See diagram", mountPattern: "66.0 x 48.3mm" },
  { name: "Arduino Mega 2560", width: "101.6mm", height: "53.3mm", holes: "4x M3", spacing: "See diagram", mountPattern: "96.5 x 48.3mm" },
  { name: "Arduino Nano", width: "43.2mm", height: "18.5mm", holes: "None (breadboard)", spacing: "N/A", mountPattern: "2.54mm pin pitch" },
  { name: "Raspberry Pi 4", width: "85.6mm", height: "56.5mm", holes: "4x M2.5 (2.7mm)", spacing: "58mm x 49mm", mountPattern: "58.0 x 49.0mm" },
  { name: "Raspberry Pi Pico", width: "51.0mm", height: "21.0mm", holes: "4x M2 (2.1mm)", spacing: "47mm x 11.4mm", mountPattern: "47.0 x 11.4mm" },
  { name: "ESP32 DevKit", width: "55.3mm", height: "28.0mm", holes: "None (breadboard)", spacing: "N/A", mountPattern: "2.54mm pin pitch" },
  { name: "Micro:bit", width: "52.0mm", height: "42.0mm", holes: "1x M3 (bottom)", spacing: "N/A", mountPattern: "Edge connector" },
];

const MountingHoles = () => (
  <div className="mx-auto max-w-3xl p-6">
    <Button variant="ghost" size="sm" asChild className="mb-4">
      <Link to="/forge"><ArrowLeft className="mr-2 h-4 w-4" />The Forge</Link>
    </Button>
    <h1 className="mb-2 text-2xl font-bold text-foreground">Mounting Hole Calculator</h1>
    <p className="mb-6 text-muted-foreground">Reference for board dimensions and screw hole spacing</p>

    <div className="space-y-3">
      {boards.map((board) => (
        <Card key={board.name}>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{board.name}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Dimensions</span><span className="font-mono">{board.width} × {board.height}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Holes</span><span className="font-mono">{board.holes}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mount Pattern</span><span className="font-mono">{board.mountPattern}</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default MountingHoles;

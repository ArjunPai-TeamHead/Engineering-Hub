import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const asciiData = Array.from({ length: 128 }, (_, i) => {
  let display = "";
  if (i <= 32 || i === 127) {
    const names: Record<number, string> = { 0: "NUL", 1: "SOH", 2: "STX", 3: "ETX", 4: "EOT", 5: "ENQ", 6: "ACK", 7: "BEL", 8: "BS", 9: "TAB", 10: "LF", 11: "VT", 12: "FF", 13: "CR", 14: "SO", 15: "SI", 16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB", 24: "CAN", 25: "EM", 26: "SUB", 27: "ESC", 28: "FS", 29: "GS", 30: "RS", 31: "US", 32: "SP", 127: "DEL" };
    display = names[i] || "CTRL";
  } else {
    display = String.fromCharCode(i);
  }
  return { dec: i, hex: i.toString(16).toUpperCase().padStart(2, "0"), char: display };
});

const AsciiTable = () => {
  const [filter, setFilter] = useState("");
  const filtered = asciiData.filter(
    (r) =>
      r.dec.toString().includes(filter) ||
      r.hex.toLowerCase().includes(filter.toLowerCase()) ||
      r.char.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link to="/toolbox" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Toolbox
      </Link>
      <Card>
        <CardHeader><CardTitle>ASCII Table</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder="Search by decimal, hex, or character..." value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-4" />
          <div className="max-h-[60vh] overflow-auto rounded border border-border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted">
                <tr><th className="p-2 text-left font-medium">Dec</th><th className="p-2 text-left font-medium">Hex</th><th className="p-2 text-left font-medium">Char</th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.dec} className="border-t border-border hover:bg-muted/50">
                    <td className="p-2 font-mono">{r.dec}</td>
                    <td className="p-2 font-mono">0x{r.hex}</td>
                    <td className="p-2 font-mono font-semibold">{r.char}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsciiTable;

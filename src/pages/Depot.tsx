import { useState } from "react";
import { ShoppingCart, Search, Package, Box, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { components } from "@/data/componentLibrary";

// Mock pricing data
const mockPricing: Record<string, { price: number; inStock: boolean; vendor: string }> = {
  "arduino-uno": { price: 499, inStock: true, vendor: "Robu.in" },
  "arduino-nano": { price: 249, inStock: true, vendor: "Robu.in" },
  "esp32": { price: 399, inStock: true, vendor: "Robu.in" },
  "esp8266": { price: 199, inStock: false, vendor: "Robu.in" },
  "rpi-pico": { price: 349, inStock: true, vendor: "Robu.in" },
  "dht11": { price: 99, inStock: true, vendor: "Robu.in" },
  "dht22": { price: 199, inStock: true, vendor: "Robu.in" },
  "hcsr04": { price: 49, inStock: true, vendor: "Robu.in" },
  "servo-sg90": { price: 89, inStock: true, vendor: "Robu.in" },
  "oled-ssd1306": { price: 179, inStock: true, vendor: "Robu.in" },
  "l298n": { price: 149, inStock: true, vendor: "Robu.in" },
  "mpu6050": { price: 129, inStock: false, vendor: "Robu.in" },
  "resistor": { price: 10, inStock: true, vendor: "Robu.in" },
  "led-single": { price: 5, inStock: true, vendor: "Robu.in" },
  "breadboard-full": { price: 69, inStock: true, vendor: "Robu.in" },
  "jumper-wires": { price: 49, inStock: true, vendor: "Robu.in" },
};

const Depot = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [vendor, setVendor] = useState("Robu.in");

  const pricedComponents = components
    .filter((c) => mockPricing[c.id])
    .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = mockPricing[id];
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber/10 p-2" style={{ boxShadow: "0 0 20px hsl(38 92% 50% / 0.3)" }}>
            <ShoppingCart className="h-6 w-6 text-amber" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">The Depot</h1>
            <p className="text-muted-foreground">Browse parts, check prices, build your cart</p>
          </div>
        </div>
        {cartCount > 0 && (
          <Card className="border-amber/30 bg-amber/5">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <Package className="h-5 w-5 text-amber" />
              <div>
                <p className="text-sm font-semibold text-foreground">{cartCount} items</p>
                <p className="text-xs text-muted-foreground">₹{cartTotal.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vendor toggle */}
      <div className="mb-4 flex gap-2">
        {["Robu.in", "Mouser", "DigiKey"].map((v) => (
          <button key={v} onClick={() => setVendor(v)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${vendor === v ? "border-amber bg-amber/10 text-amber" : "border-border text-muted-foreground"}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search catalog..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pricedComponents.map((comp) => {
          const pricing = mockPricing[comp.id];
          return (
            <Card key={comp.id} className="transition-all hover:border-amber/40">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{comp.name}</CardTitle>
                  <Badge variant={pricing.inStock ? "default" : "destructive"} className="text-[10px]">
                    {pricing.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{comp.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-amber" />
                  <span className="font-mono text-sm font-bold text-foreground">₹{pricing.price}</span>
                </div>
                <Button size="sm" variant="outline" disabled={!pricing.inStock} onClick={() => addToCart(comp.id)} className="text-xs">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* My Parts Box placeholder */}
      <Card className="mt-8 border-dashed">
        <CardHeader className="flex flex-row items-center gap-4">
          <Box className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <CardTitle className="text-base">My Parts Box</CardTitle>
            <CardDescription>Digital inventory of your owned components — "Can I Build It?" scanner coming soon</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Depot;

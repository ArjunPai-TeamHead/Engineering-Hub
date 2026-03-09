import { useState, useEffect } from "react";
import {
  ShoppingCart, Search, Package, Box, Plus, Minus, Trash2, CreditCard,
  Heart, History, Clock, CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { components, categories } from "@/data/componentLibrary";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import CheckoutModal, { type CheckoutDetails } from "@/components/depot/CheckoutModal";

const pricing: Record<string, { robu: number | null; amazon: number | null; inStock: boolean }> = {
  "arduino-uno": { robu: 1801, amazon: 1339, inStock: true },
  "arduino-mega": { robu: 2250, amazon: 1999, inStock: true },
  "arduino-nano": { robu: 249, amazon: 199, inStock: true },
  "rpi-4": { robu: 7499, amazon: 8000, inStock: true },
  "rpi-pico": { robu: 450, amazon: 499, inStock: true },
  "esp32": { robu: 599, amazon: 600, inStock: true },
  "esp8266": { robu: 299, amazon: 300, inStock: true },
  "stm32-blue": { robu: 229, amazon: 199, inStock: true },
  "microbit": { robu: 1838, amazon: null, inStock: true },
  "attiny85": { robu: 251, amazon: null, inStock: true },
  "resistor": { robu: 10, amazon: 10, inStock: true },
  "pot-rotary": { robu: 25, amazon: 30, inStock: true },
  "ldr": { robu: 29, amazon: 29, inStock: true },
  "thermistor": { robu: 35, amazon: 40, inStock: true },
  "cap-ceramic": { robu: 5, amazon: 5, inStock: true },
  "cap-electrolytic": { robu: 8, amazon: 10, inStock: true },
  "inductor": { robu: 15, amazon: 20, inStock: true },
  "diode-1n4007": { robu: 5, amazon: 5, inStock: true },
  "diode-1n4148": { robu: 3, amazon: 5, inStock: true },
  "zener": { robu: 5, amazon: 8, inStock: true },
  "led-single": { robu: 5, amazon: 5, inStock: true },
  "led-rgb": { robu: 12, amazon: 15, inStock: true },
  "neopixel-ring": { robu: 299, amazon: 299, inStock: true },
  "neopixel-strip": { robu: 499, amazon: 499, inStock: true },
  "npn-2n2222": { robu: 5, amazon: 8, inStock: true },
  "npn-bc547": { robu: 3, amazon: 5, inStock: true },
  "pnp-2n3906": { robu: 5, amazon: 8, inStock: true },
  "mosfet-irlz44n": { robu: 45, amazon: 50, inStock: true },
  "darlington-tip120": { robu: 25, amazon: 30, inStock: true },
  "relay": { robu: 49, amazon: 55, inStock: true },
  "hcsr04": { robu: 120, amazon: 99, inStock: true },
  "dht11": { robu: 149, amazon: 150, inStock: true },
  "dht22": { robu: 379, amazon: 399, inStock: true },
  "bmp280": { robu: 299, amazon: 350, inStock: true },
  "mpu6050": { robu: 359, amazon: 299, inStock: true },
  "pir": { robu: 129, amazon: 149, inStock: true },
  "mq2": { robu: 179, amazon: 199, inStock: true },
  "mq135": { robu: 199, amazon: 220, inStock: true },
  "soil-moisture": { robu: 129, amazon: 150, inStock: true },
  "sound-sensor": { robu: 149, amazon: 150, inStock: true },
  "flex-sensor": { robu: 299, amazon: 350, inStock: true },
  "fsr": { robu: 299, amazon: 350, inStock: true },
  "hall-effect": { robu: 79, amazon: 99, inStock: true },
  "ir-receiver": { robu: 25, amazon: 30, inStock: true },
  "ir-remote": { robu: 199, amazon: 199, inStock: true },
  "pushbutton": { robu: 5, amazon: 5, inStock: true },
  "slide-switch": { robu: 10, amazon: 12, inStock: true },
  "toggle-switch": { robu: 15, amazon: 20, inStock: true },
  "keypad-4x4": { robu: 249, amazon: 250, inStock: true },
  "rotary-encoder": { robu: 199, amazon: 220, inStock: true },
  "servo-sg90": { robu: 179, amazon: 150, inStock: true },
  "servo-mg996r": { robu: 899, amazon: 799, inStock: true },
  "dc-motor": { robu: 99, amazon: 90, inStock: true },
  "stepper-28byj": { robu: 199, amazon: 180, inStock: true },
  "uln2003": { robu: 99, amazon: 90, inStock: true },
  "l298n": { robu: 89, amazon: 80, inStock: true },
  "l293d": { robu: 45, amazon: 50, inStock: true },
  "vibration-motor": { robu: 49, amazon: 50, inStock: true },
  "buzzer-active": { robu: 25, amazon: 25, inStock: true },
  "buzzer-passive": { robu: 20, amazon: 25, inStock: true },
  "bluetooth-hc05": { robu: 299, amazon: 300, inStock: true },
  "nrf24l01": { robu: 149, amazon: 150, inStock: true },
  "7seg": { robu: 249, amazon: 250, inStock: true },
  "lcd-16x2-parallel": { robu: 179, amazon: 150, inStock: true },
  "lcd-16x2-i2c": { robu: 299, amazon: 350, inStock: true },
  "oled-ssd1306": { robu: 189, amazon: 145, inStock: true },
  "tft-ili9341": { robu: 899, amazon: 800, inStock: true },
  "led-matrix": { robu: 449, amazon: 399, inStock: true },
  "logic-gates": { robu: 15, amazon: 20, inStock: true },
  "shift-register": { robu: 20, amazon: 25, inStock: true },
  "555-timer": { robu: 10, amazon: 12, inStock: true },
  "opamp-lm358": { robu: 15, amazon: 18, inStock: true },
  "rtc-ds3231": { robu: 349, amazon: 399, inStock: true },
  "sd-card": { robu: 179, amazon: 199, inStock: true },
  "vreg-7805": { robu: 12, amazon: 15, inStock: true },
  "vreg-lm317": { robu: 15, amazon: 18, inStock: true },
  "battery-9v": { robu: 35, amazon: 40, inStock: true },
  "battery-lipo": { robu: 299, amazon: 350, inStock: true },
  "solar-panel": { robu: 299, amazon: 350, inStock: true },
  "breadboard-full": { robu: 199, amazon: 199, inStock: true },
  "breadboard-half": { robu: 99, amazon: 99, inStock: true },
  "jumper-wires": { robu: 149, amazon: 150, inStock: true },
};

interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
}

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-amber" />,
  completed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-destructive" />,
};

const Depot = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("shop");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase.from("wishlist").select("component_id").eq("user_id", user.id).then(({ data }) => {
      if (data) setWishlist(new Set(data.map(w => w.component_id)));
    });
  }, [user]);

  useEffect(() => {
    if (!user || activeTab !== "orders") return;
    setLoadingOrders(true);
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setOrders(data as any);
      setLoadingOrders(false);
    });
  }, [user, activeTab]);

  const toggleWishlist = async (componentId: string) => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
    if (wishlist.has(componentId)) {
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("component_id", componentId);
      setWishlist(prev => { const n = new Set(prev); n.delete(componentId); return n; });
    } else {
      await supabase.from("wishlist").insert({ user_id: user.id, component_id: componentId });
      setWishlist(prev => new Set(prev).add(componentId));
    }
  };

  const getBestPrice = (id: string) => {
    const p = pricing[id];
    if (!p) return null;
    const prices = [p.robu, p.amazon].filter(Boolean) as number[];
    return prices.length ? Math.min(...prices) : null;
  };

  const filteredComponents = components
    .filter(c => {
      if (activeTab === "wishlist") return wishlist.has(c.id);
      return activeCategory === "all" || c.category === activeCategory;
    })
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => sum + ((getBestPrice(id) || 0) * qty), 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const comp = components.find(c => c.id === id);
    return { id, name: comp?.name || id, price: getBestPrice(id) || 0, quantity: qty };
  });

  const handleCheckout = () => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
    setCheckoutOpen(true);
  };

  const handleCheckoutConfirm = async (details: CheckoutDetails) => {
    const items = cartItems.map(({ id, name, quantity }) => ({ id, name, quantity }));

    await supabase.from("orders").insert({
      user_id: user!.id,
      items: items as any,
      total_amount: cartTotal,
      currency: "INR",
      status: "pending",
    });

    try {
      const { data, error } = await supabase.functions.invoke("create-depot-checkout", { body: { items } });
      if (error) throw error;
      if (data?.url) { window.open(data.url, "_blank"); setCart({}); setCheckoutOpen(false); }
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    }
  };

  const renderProductCard = (comp: typeof components[0]) => {
    const bestPrice = getBestPrice(comp.id);
    const p = pricing[comp.id];
    const qty = cart[comp.id] || 0;
    const isWished = wishlist.has(comp.id);

    return (
      <Card key={comp.id} className="ios-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm leading-tight">{comp.name}</CardTitle>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleWishlist(comp.id)} className="p-1 rounded-full hover:bg-accent transition-colors">
                <Heart className={`h-4 w-4 ${isWished ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
              </button>
              {p && (
                <Badge variant={p.inStock ? "default" : "destructive"} className="text-[10px] shrink-0 rounded-full">
                  {p.inStock ? "In Stock" : "Out"}
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-xs line-clamp-2">{comp.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-0">
          {bestPrice ? (
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold text-foreground">₹{bestPrice.toLocaleString("en-IN")}</span>
              {p?.robu && p?.amazon && p.robu !== p.amazon && (
                <span className="text-[10px] text-muted-foreground">{p.robu < p.amazon ? "Robu" : "Amazon"} best</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Price TBD</span>
          )}
          {qty > 0 ? (
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => removeFromCart(comp.id)}>
                {qty === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              </Button>
              <span className="w-6 text-center text-sm font-mono font-bold">{qty}</span>
              <Button size="icon" variant="outline" className="h-7 w-7 rounded-full" onClick={() => addToCart(comp.id)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="text-xs rounded-xl" onClick={() => addToCart(comp.id)}>Add</Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber/10 p-2.5">
            <ShoppingCart className="h-6 w-6 text-amber" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">The Depot</h1>
            <p className="text-muted-foreground">Browse parts, compare prices, build your cart</p>
          </div>
        </div>
        {cartCount > 0 && (
          <Card className="ios-card border-primary/20">
            <CardContent className="flex items-center gap-4 py-3 px-4">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{cartCount} items</p>
                <p className="text-xs text-muted-foreground font-mono">₹{cartTotal.toLocaleString("en-IN")}</p>
              </div>
              <Button size="sm" onClick={handleCheckout} className="rounded-xl gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Checkout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-5">
        <TabsList>
          <TabsTrigger value="shop"><ShoppingCart className="h-4 w-4 mr-1" /> Shop</TabsTrigger>
          <TabsTrigger value="wishlist"><Heart className="h-4 w-4 mr-1" /> Wishlist ({wishlist.size})</TabsTrigger>
          <TabsTrigger value="orders"><History className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-4">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search components..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl h-11" />
          </div>
          <ScrollArea className="mb-5">
            <div className="flex gap-2 pb-2">
              <button onClick={() => setActiveCategory("all")} className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                All ({components.length})
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredComponents.map(renderProductCard)}
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-4">
          {wishlist.size === 0 ? (
            <Card className="ios-card border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Your wishlist is empty</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Tap the ♡ on any component to save it</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredComponents.map(renderProductCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          {!user ? (
            <Card className="ios-card border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">Sign in to view order history</CardContent>
            </Card>
          ) : loadingOrders ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : orders.length === 0 ? (
            <Card className="ios-card border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Card key={order.id} className="ios-card">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {statusIcon[order.status] || statusIcon.pending}
                        <span className="text-sm font-medium text-foreground capitalize">{order.status}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1">
                      {(order.items as any[]).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                          <span className="font-mono text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between">
                      <span className="text-sm font-semibold text-foreground">Total</span>
                      <span className="font-mono font-bold text-foreground">₹{order.total_amount.toLocaleString("en-IN")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {activeTab === "shop" && (
        <Card className="mt-8 ios-card border-dashed">
          <CardHeader className="flex flex-row items-center gap-4">
            <Box className="h-8 w-8 text-muted-foreground/40" />
            <div>
              <CardTitle className="text-base">My Parts Box</CardTitle>
              <CardDescription>Digital inventory of your owned components — track what you have and scan project BOMs</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        total={cartTotal}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
};

export default Depot;

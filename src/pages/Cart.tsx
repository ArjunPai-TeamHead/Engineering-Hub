import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Truck, Shield, RotateCcw, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { components } from "@/data/componentLibrary";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CheckoutModal, { type CheckoutDetails } from "@/components/depot/CheckoutModal";

// Mirror of Depot pricing — kept in sync; in the future move to a shared module.
const pricing: Record<string, { robu: number | null; amazon: number | null }> = {
  "arduino-uno": { robu: 1801, amazon: 1339 }, "arduino-mega": { robu: 2250, amazon: 1999 },
  "arduino-nano": { robu: 249, amazon: 199 }, "rpi-4": { robu: 7499, amazon: 8000 },
  "rpi-pico": { robu: 450, amazon: 499 }, "esp32": { robu: 599, amazon: 600 },
  "esp8266": { robu: 299, amazon: 300 }, "stm32-blue": { robu: 229, amazon: 199 },
  "resistor": { robu: 10, amazon: 10 }, "led-single": { robu: 5, amazon: 5 },
  "led-rgb": { robu: 12, amazon: 15 }, "neopixel-ring": { robu: 299, amazon: 299 },
  "hcsr04": { robu: 120, amazon: 99 }, "dht11": { robu: 149, amazon: 150 },
  "dht22": { robu: 379, amazon: 399 }, "mpu6050": { robu: 359, amazon: 299 },
  "servo-sg90": { robu: 179, amazon: 150 }, "servo-mg996r": { robu: 899, amazon: 799 },
  "dc-motor": { robu: 99, amazon: 90 }, "buzzer-active": { robu: 25, amazon: 25 },
};

function getPrice(id: string): number {
  const p = pricing[id];
  if (!p) return 0;
  const arr = [p.robu, p.amazon].filter(Boolean) as number[];
  return arr.length ? Math.min(...arr) : 0;
}

const getName = (id: string) => components.find(c => c.id === id)?.name || id;
const getDesc = (id: string) => components.find(c => c.id === id)?.description || "";

const Cart = () => {
  const { cart, saved, setQty, removeFromCart, saveForLater, moveToCart, removeSaved, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cartEntries = Object.entries(cart);
  const savedEntries = Object.entries(saved);

  const subtotal = cartEntries.reduce((s, [id, q]) => s + getPrice(id) * q, 0);
  const itemCount = cartEntries.reduce((s, [, q]) => s + q, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + gst + shipping;

  // Recommended: top 6 stocked components not already in cart
  const recommended = useMemo(() => {
    const inCart = new Set([...Object.keys(cart), ...Object.keys(saved)]);
    return components
      .filter(c => !inCart.has(c.id) && pricing[c.id])
      .slice(0, 6);
  }, [cart, saved]);

  const cartItems = cartEntries.map(([id, qty]) => ({ id, name: getName(id), price: getPrice(id), quantity: qty }));

  const handleCheckoutConfirm = async (details: CheckoutDetails) => {
    if (!user) { toast({ title: "Sign in required", variant: "destructive" }); return; }
    const items = cartItems.map(({ id, name, quantity }) => ({ id, name, quantity, price: getPrice(id) }));
    const safeShipping = { ...details, cardNumber: details.cardNumber ? `**** **** **** ${details.cardNumber.slice(-4)}` : "", cardCvv: "" };

    const { data: orderRow, error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: items as any,
      total_amount: total,
      gst_amount: gst,
      shipping_cost: shipping,
      currency: "INR",
      status: "pending",
      payment_method: details.paymentMethod,
      shipping_details: safeShipping as any,
    }).select("id").maybeSingle();

    if (error) { toast({ title: "Order failed", description: error.message, variant: "destructive" }); return; }

    clearCart();
    setCheckoutOpen(false);
    toast({ title: "Order placed!", description: "Your order is on its way." });
    if (orderRow?.id) navigate(`/order-placed?id=${orderRow.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#eaeded] dark:bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link to="/depot"><ArrowLeft className="h-4 w-4 mr-1" /> Continue shopping</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          {/* LEFT: cart items + saved + recommended */}
          <div className="space-y-4">
            <Card className="rounded-2xl bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
                  {cartEntries.length > 0 && (
                    <span className="text-xs text-muted-foreground">Price</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4 border-b border-border pb-3">
                  {cartEntries.length === 0 ? "Your cart is empty" : `${itemCount} item${itemCount !== 1 ? "s" : ""}`}
                </p>

                {cartEntries.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingCart className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Your EngiNexus Cart is empty</p>
                    <Button asChild className="rounded-full"><Link to="/depot">Shop deals</Link></Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {cartEntries.map(([id, qty]) => {
                      const price = getPrice(id);
                      return (
                        <div key={id} className="flex gap-4 py-4">
                          <div className="h-24 w-24 shrink-0 rounded-xl bg-muted flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/lab/component/${id}`} className="text-base font-medium text-foreground hover:text-primary line-clamp-2">{getName(id)}</Link>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{getDesc(id)}</p>
                            <p className="text-xs text-emerald-600 mt-1 font-medium">In Stock</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">Eligible for FREE Shipping</p>

                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                              <div className="flex items-center gap-1 rounded-full border border-border bg-amber-50 dark:bg-card px-1 py-0.5">
                                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setQty(id, qty - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-6 text-center text-foreground">{qty}</span>
                                <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setQty(id, qty + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Separator orientation="vertical" className="h-5" />
                              <button onClick={() => removeFromCart(id)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                              <Separator orientation="vertical" className="h-5" />
                              <button onClick={() => saveForLater(id)} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                <Heart className="h-3 w-3" /> Save for later
                              </button>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-foreground">₹{(price * qty).toLocaleString("en-IN")}</p>
                            {qty > 1 && <p className="text-[11px] text-muted-foreground mt-1">₹{price.toLocaleString("en-IN")} each</p>}
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 text-right">
                      <p className="text-base">
                        Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):{" "}
                        <span className="font-bold text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved for Later */}
            {savedEntries.length > 0 && (
              <Card className="rounded-2xl bg-white dark:bg-card border-border/50 shadow-sm">
                <CardContent className="p-5">
                  <h2 className="text-xl font-bold text-foreground mb-1">Saved for later ({savedEntries.length})</h2>
                  <div className="divide-y divide-border mt-3">
                    {savedEntries.map(([id, qty]) => (
                      <div key={id} className="flex gap-4 py-4">
                        <div className="h-20 w-20 shrink-0 rounded-xl bg-muted flex items-center justify-center">
                          <Heart className="h-7 w-7 text-muted-foreground/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{getName(id)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Qty: {qty}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button onClick={() => moveToCart(id)} className="text-xs text-blue-600 hover:underline">Move to cart</button>
                            <Separator orientation="vertical" className="h-4" />
                            <button onClick={() => removeSaved(id)} className="text-xs text-blue-600 hover:underline">Delete</button>
                          </div>
                        </div>
                        <p className="text-right font-bold text-foreground shrink-0">₹{(getPrice(id) * qty).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended */}
            {recommended.length > 0 && (
              <Card className="rounded-2xl bg-white dark:bg-card border-border/50 shadow-sm">
                <CardContent className="p-5">
                  <h2 className="text-xl font-bold text-foreground mb-3">Recommended based on your cart</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {recommended.map(comp => {
                      const price = getPrice(comp.id);
                      return (
                        <div key={comp.id} className="rounded-xl border border-border p-3 flex flex-col">
                          <div className="aspect-square rounded-lg bg-muted mb-2 flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                          <p className="text-xs font-medium text-foreground line-clamp-2 mb-1">{comp.name}</p>
                          <p className="text-sm font-bold text-foreground mb-2">₹{price.toLocaleString("en-IN")}</p>
                          <Button size="sm" className="w-full text-xs rounded-full mt-auto bg-amber-400 hover:bg-amber-500 text-black border-0" onClick={() => moveToCart(comp.id) /* noop wrapper, use addToCart via cart hook below */ }>
                            <Link to={`/depot`} className="contents">View in Depot</Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: order summary */}
          <div className="space-y-4">
            <Card className="rounded-2xl bg-white dark:bg-card border-border/50 shadow-sm sticky top-16">
              <CardContent className="p-5 space-y-3">
                {subtotal > 500 && (
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 flex items-start gap-1.5">
                    <Truck className="h-4 w-4 mt-0.5 shrink-0" />
                    Your order qualifies for <strong>FREE Shipping</strong>
                  </p>
                )}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({itemCount} items)</span><span className="font-mono text-foreground">₹{subtotal.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="font-mono text-foreground">₹{gst.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-mono text-foreground">{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-foreground">Order total:</span>
                  <span className="font-bold text-rose-600">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <Button
                  className="w-full rounded-full bg-amber-400 hover:bg-amber-500 text-black border-0 font-semibold"
                  disabled={cartEntries.length === 0}
                  onClick={() => {
                    if (!user) { toast({ title: "Sign in required" }); navigate("/signin"); return; }
                    setCheckoutOpen(true);
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-1.5" /> Proceed to checkout
                </Button>
                <div className="pt-2 space-y-1.5 text-[11px] text-muted-foreground">
                  <p className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> Secure transaction</p>
                  <p className="flex items-center gap-1.5"><RotateCcw className="h-3 w-3" /> Free 30-day returns</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <CheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          items={cartItems}
          total={subtotal}
          onConfirm={handleCheckoutConfirm}
        />
      </div>
    </div>
  );
};

export default Cart;

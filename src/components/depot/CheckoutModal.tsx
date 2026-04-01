import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Truck, User, Package, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onConfirm: (details: CheckoutDetails) => Promise<void>;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  gstNumber: string;
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  deliveryInstructions: string;
  billingName: string;
  billingAddress: string;
  sameAsShipping: boolean;
  shippingMethod: string;
  couponCode: string;
}

const CheckoutModal = ({ open, onClose, items, total, onConfirm }: CheckoutModalProps) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<"cart" | "details" | "shipping" | "confirm">("cart");
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState<CheckoutDetails>({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    gstNumber: "",
    recipientName: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    deliveryInstructions: "",
    billingName: "",
    billingAddress: "",
    sameAsShipping: true,
    shippingMethod: "standard",
    couponCode: "",
  });

  const set = (key: keyof CheckoutDetails, val: string | boolean) =>
    setDetails(prev => ({ ...prev, [key]: val }));

  const shippingCost = details.shippingMethod === "express" ? 149 : details.shippingMethod === "sameday" ? 299 : 49;
  const grandTotal = total + shippingCost;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(details);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="flex items-center gap-2">
            {step === "cart" && <><Package className="h-5 w-5 text-primary" /> Your Cart</>}
            {step === "details" && <><User className="h-5 w-5 text-primary" /> Customer Details</>}
            {step === "shipping" && <><Truck className="h-5 w-5 text-primary" /> Shipping & Billing</>}
            {step === "confirm" && <><CreditCard className="h-5 w-5 text-primary" /> Order Summary</>}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[60vh]">
          {step === "cart" && (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-sm font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-foreground">Subtotal</span>
                <span className="font-mono font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Personal Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name *</Label>
                  <Input value={details.fullName} onChange={e => set("fullName", e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email *</Label>
                  <Input value={details.email} onChange={e => set("email", e.target.value)} type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone *</Label>
                  <Input value={details.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company (optional)</Label>
                  <Input value={details.companyName} onChange={e => set("companyName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">GST/VAT Number (optional)</Label>
                <Input value={details.gstNumber} onChange={e => set("gstNumber", e.target.value)} placeholder="22AAAAA0000A1Z5" />
              </div>
              {user && (
                <div className="rounded-lg border border-border p-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground">Account ID: <span className="font-mono text-foreground">{user.id.slice(0, 8)}...</span></p>
                </div>
              )}
            </div>
          )}

          {step === "shipping" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Shipping Address</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Recipient Name</Label>
                  <Input value={details.recipientName} onChange={e => set("recipientName", e.target.value)} placeholder="Same as buyer if empty" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Address Line 1 *</Label>
                  <Input value={details.addressLine1} onChange={e => set("addressLine1", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Address Line 2</Label>
                  <Input value={details.addressLine2} onChange={e => set("addressLine2", e.target.value)} placeholder="Apt / Flat / Floor" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Landmark</Label>
                  <Input value={details.landmark} onChange={e => set("landmark", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">City *</Label>
                  <Input value={details.city} onChange={e => set("city", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">State *</Label>
                  <Input value={details.state} onChange={e => set("state", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">PIN Code *</Label>
                  <Input value={details.pinCode} onChange={e => set("pinCode", e.target.value)} placeholder="560001" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Country</Label>
                  <Input value={details.country} onChange={e => set("country", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Delivery Instructions (optional)</Label>
                <Input value={details.deliveryInstructions} onChange={e => set("deliveryInstructions", e.target.value)} placeholder="Ring doorbell, leave at gate..." />
              </div>

              <Separator />

              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Shipping Method</p>
              <Select value={details.shippingMethod} onValueChange={v => set("shippingMethod", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (5-7 days) — ₹49</SelectItem>
                  <SelectItem value="express">Express (2-3 days) — ₹149</SelectItem>
                  <SelectItem value="sameday">Same Day — ₹299</SelectItem>
                </SelectContent>
              </Select>

              <Separator />

              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Billing Information</p>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={details.sameAsShipping}
                  onCheckedChange={v => set("sameAsShipping", !!v)}
                  id="same-shipping"
                />
                <Label htmlFor="same-shipping" className="text-xs">Same as shipping address</Label>
              </div>
              {!details.sameAsShipping && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Billing Name</Label>
                    <Input value={details.billingName} onChange={e => set("billingName", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Billing Address</Label>
                    <Input value={details.billingAddress} onChange={e => set("billingAddress", e.target.value)} />
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-1.5">
                <Label className="text-xs">Coupon Code</Label>
                <Input value={details.couponCode} onChange={e => set("couponCode", e.target.value)} placeholder="SAVE10" />
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ship To</p>
                <p className="text-sm text-foreground">{details.recipientName || details.fullName}</p>
                <p className="text-xs text-muted-foreground">{details.addressLine1}{details.addressLine2 ? `, ${details.addressLine2}` : ""}</p>
                <p className="text-xs text-muted-foreground">{details.city}, {details.state} {details.pinCode}</p>
                <p className="text-xs text-muted-foreground">{details.phone}</p>
              </div>

              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span className="font-mono text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono text-foreground">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping ({details.shippingMethod})</span>
                  <span className="font-mono text-foreground">₹{shippingCost}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="font-mono text-foreground">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border flex justify-between">
          {step !== "cart" ? (
            <Button variant="outline" size="sm" onClick={() => {
              if (step === "details") setStep("cart");
              if (step === "shipping") setStep("details");
              if (step === "confirm") setStep("shipping");
            }}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
            </Button>
          ) : <div />}

          {step === "cart" && (
            <Button size="sm" onClick={() => setStep("details")}>
              Proceed <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
          {step === "details" && (
            <Button size="sm" onClick={() => setStep("shipping")} disabled={!details.fullName || !details.email || !details.phone}>
              Continue <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
          {step === "shipping" && (
            <Button size="sm" onClick={() => setStep("confirm")} disabled={!details.addressLine1 || !details.city || !details.state || !details.pinCode}>
              Review Order <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
          {step === "confirm" && (
            <Button size="sm" onClick={handleConfirm} disabled={loading}>
              {loading ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <CreditCard className="h-3.5 w-3.5 mr-1" />}
              Pay ₹{grandTotal.toLocaleString("en-IN")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;

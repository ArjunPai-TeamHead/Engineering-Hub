import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface OrderItem { name: string; quantity: number; }
interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  created_at: string;
  payment_method?: string;
}

const OrderPlaced = () => {
  const [params] = useSearchParams();
  const orderId = params.get("id");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.3 } });
    if (!orderId) return;
    supabase.from("orders").select("*").eq("id", orderId).maybeSingle().then(({ data }) => {
      if (data) setOrder(data as any);
    });
  }, [orderId]);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card className="border-emerald-500/30 bg-emerald-500/5 mb-4">
        <CardContent className="py-10 text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-sm text-muted-foreground mb-1">Thank you for shopping with EngiNexus.</p>
          {orderId && <p className="text-xs text-muted-foreground font-mono">Order ID: {orderId.slice(0, 13)}...</p>}
        </CardContent>
      </Card>

      {order && (
        <Card className="mb-4">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Order Summary</p>
            </div>
            <div className="space-y-1.5 mb-3">
              {(order.items as any[]).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-border flex justify-between">
              <span className="text-sm font-semibold text-foreground">Total Paid</span>
              <span className="font-mono font-bold text-foreground">₹{order.total_amount.toLocaleString("en-IN")}</span>
            </div>
            {order.payment_method && (
              <p className="text-xs text-muted-foreground mt-2">Payment via <span className="capitalize font-medium text-foreground">{order.payment_method}</span></p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/depot"><ShoppingBag className="h-4 w-4 mr-1" /> Continue Shopping</Link>
        </Button>
        <Button asChild className="rounded-xl">
          <Link to="/depot?tab=orders">View Orders <ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderPlaced;

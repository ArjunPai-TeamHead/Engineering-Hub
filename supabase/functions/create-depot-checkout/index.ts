import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_CATALOG: Record<string, number> = {
  "arduino-uno": 1339, "arduino-mega": 1999, "arduino-nano": 199,
  "rpi-4": 7499, "rpi-pico": 450, "esp32": 599, "esp8266": 299,
  "stm32-blue": 199, "microbit": 1838, "attiny85": 251,
  "resistor": 10, "pot-rotary": 25, "ldr": 29, "thermistor": 35,
  "cap-ceramic": 5, "cap-electrolytic": 8, "inductor": 15,
  "diode-1n4007": 5, "diode-1n4148": 3, "zener": 5,
  "led-single": 5, "led-rgb": 12, "neopixel-ring": 299, "neopixel-strip": 499,
  "npn-2n2222": 5, "npn-bc547": 3, "pnp-2n3906": 5,
  "mosfet-irlz44n": 45, "darlington-tip120": 25, "relay": 49,
  "hcsr04": 99, "dht11": 149, "dht22": 379, "bmp280": 299,
  "mpu6050": 299, "pir": 129, "mq2": 179, "mq135": 199,
  "soil-moisture": 129, "sound-sensor": 149, "flex-sensor": 299,
  "fsr": 299, "hall-effect": 79, "ir-receiver": 25, "ir-remote": 199,
  "pushbutton": 5, "slide-switch": 10, "toggle-switch": 15,
  "keypad-4x4": 249, "rotary-encoder": 199,
  "servo-sg90": 150, "servo-mg996r": 799, "dc-motor": 90,
  "stepper-28byj": 180, "uln2003": 90, "l298n": 80, "l293d": 45,
  "vibration-motor": 49, "buzzer-active": 25, "buzzer-passive": 20,
  "bluetooth-hc05": 299, "nrf24l01": 149,
  "7seg": 249, "lcd-16x2-parallel": 150, "lcd-16x2-i2c": 299,
  "oled-ssd1306": 145, "tft-ili9341": 800, "led-matrix": 399,
  "logic-gates": 15, "shift-register": 20, "555-timer": 10,
  "opamp-lm358": 15, "rtc-ds3231": 349, "sd-card": 179,
  "vreg-7805": 12, "vreg-lm317": 15, "battery-9v": 35,
  "battery-lipo": 299, "solar-panel": 299,
  "breadboard-full": 199, "breadboard-half": 99, "jumper-wires": 149,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const { items } = await req.json();

    const line_items = items.map((item: { id: string; name: string; quantity: number }) => {
      const catalogPrice = PRICE_CATALOG[item.id];
      if (!catalogPrice) {
        throw new Error(`Unknown component: ${item.id}`);
      }
      const quantity = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      return {
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: catalogPrice * 100,
        },
        quantity,
      };
    });

    const customers = await stripe.customers.list({ email: authUser.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) customerId = customers.data[0].id;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : authUser.email,
      line_items,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/depot?success=true`,
      cancel_url: `${req.headers.get("origin")}/depot?canceled=true`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

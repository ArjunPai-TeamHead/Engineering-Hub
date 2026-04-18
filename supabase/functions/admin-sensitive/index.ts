import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Returns sensitive admin information (orders with payment details, profile email).
// Requires admin role AND the secret pin in the request body.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin
    const { data: roleData } = await supabaseClient.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    if (roleData?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { pin, target_user_id } = await req.json();
    const ADMIN_PIN = Deno.env.get("ADMIN_SENSITIVE_PIN");
    if (!ADMIN_PIN || pin !== ADMIN_PIN) {
      return new Response(JSON.stringify({ error: "Invalid pin" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // With service role, fetch sensitive data
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Fetch full user details
    const { data: authUser } = await adminClient.auth.admin.getUserById(target_user_id);
    const { data: orders } = await adminClient.from("orders").select("*").eq("user_id", target_user_id).order("created_at", { ascending: false });
    const { data: applications } = await adminClient.from("job_applications").select("*, jobs(title, department)").eq("user_id", target_user_id);

    return new Response(JSON.stringify({
      email: authUser?.user?.email,
      phone: authUser?.user?.phone,
      created_at: authUser?.user?.created_at,
      last_sign_in_at: authUser?.user?.last_sign_in_at,
      orders: orders || [],
      applications: applications || [],
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-sensitive error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

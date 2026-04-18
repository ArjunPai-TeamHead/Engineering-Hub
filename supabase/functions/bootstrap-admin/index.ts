import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PUBLIC bootstrap: idempotently creates the default admin user.
// Safe to call repeatedly. Required only once after deploy.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ADMIN_PIN = Deno.env.get("ADMIN_SENSITIVE_PIN");
    if (!ADMIN_PIN) throw new Error("ADMIN_SENSITIVE_PIN not configured");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const ADMIN_EMAIL = "admin@enginexus.com";
    const ADMIN_PASSWORD = ADMIN_PIN;

    const { data: existingList } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingList.users.find((u: any) => u.email === ADMIN_EMAIL);

    let userId: string;
    if (existing) {
      userId = existing.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD });
    } else {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: "Administrator", username: "admin" },
      });
      if (error) throw error;
      userId = created.user!.id;
    }

    const { data: roleRow } = await supabaseAdmin.from("user_roles").select("id, role").eq("user_id", userId).maybeSingle();
    if (roleRow) {
      if (roleRow.role !== "admin") {
        await supabaseAdmin.from("user_roles").update({ role: "admin" }).eq("user_id", userId);
      }
    } else {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
    }

    const { data: prof } = await supabaseAdmin.from("profiles").select("id").eq("user_id", userId).maybeSingle();
    if (!prof) {
      await supabaseAdmin.from("profiles").insert({
        user_id: userId,
        display_name: "Administrator",
        username: "admin",
      });
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId, email: ADMIN_EMAIL }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("bootstrap-admin error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

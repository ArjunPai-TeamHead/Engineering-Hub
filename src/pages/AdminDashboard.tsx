import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ShoppingCart, GraduationCap, MessageSquare, Loader2, Trash2, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  skill_level: string | null;
  volts: number;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

const AdminDashboard = () => {
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, orders: 0, channels: 0, courses: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (role === "admin") fetchAll();
  }, [role, loading]);

  const fetchAll = async () => {
    setLoadingData(true);
    const [profilesRes, rolesRes, ordersRes, channelsRes, progressRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("hive_channels").select("*"),
      supabase.from("course_progress").select("course_id").limit(1000),
    ]);

    const profilesList = profilesRes.data || [];
    const rolesList = rolesRes.data || [];
    const ordersList = ordersRes.data || [];
    const channelsList = channelsRes.data || [];
    const uniqueCourses = new Set((progressRes.data || []).map((p: any) => p.course_id));

    setUsers(profilesList);
    setRoles(rolesList);
    setOrders(ordersList);
    setChannels(channelsList);
    setStats({
      users: profilesList.length,
      orders: ordersList.length,
      channels: channelsList.length,
      courses: uniqueCourses.size,
    });
    setLoadingData(false);
  };

  const getUserRole = (userId: string) => {
    return roles.find((r) => r.user_id === userId)?.role || "apprentice";
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole as "admin" | "apprentice" | "journeyman" | "master" })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      setRoles((prev) => prev.map((r) => (r.user_id === userId ? { ...r, role: newRole } : r)));
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (role !== "admin") return null;

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500" },
    { label: "Orders", value: stats.orders, icon: ShoppingCart, color: "text-green-500" },
    { label: "Channels", value: stats.channels, icon: MessageSquare, color: "text-purple-500" },
    { label: "Active Courses", value: stats.courses, icon: GraduationCap, color: "text-amber-500" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg bg-destructive/10 p-2">
          <Shield className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Platform management & analytics</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" />Users</TabsTrigger>
          <TabsTrigger value="orders"><ShoppingCart className="h-4 w-4 mr-1" />Orders</TabsTrigger>
          <TabsTrigger value="channels"><MessageSquare className="h-4 w-4 mr-1" />Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle>All Users ({users.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Volts</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.user_id}>
                      <TableCell className="font-medium">{u.display_name}</TableCell>
                      <TableCell><Badge variant="secondary">{u.skill_level || "beginner"}</Badge></TableCell>
                      <TableCell>{u.volts}</TableCell>
                      <TableCell>
                        <Select value={getUserRole(u.user_id)} onValueChange={(v) => updateUserRole(u.user_id, v)}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apprentice">Apprentice</SelectItem>
                            <SelectItem value="journeyman">Journeyman</SelectItem>
                            <SelectItem value="master">Master</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader><CardTitle>Recent Orders ({orders.length})</CardTitle></CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}</TableCell>
                        <TableCell><Badge variant={o.status === "completed" ? "default" : "secondary"}>{o.status}</Badge></TableCell>
                        <TableCell>₹{(o.total_amount / 100).toFixed(2)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader><CardTitle>Hive Channels ({channels.length})</CardTitle></CardHeader>
            <CardContent>
              {channels.length === 0 ? (
                <p className="text-muted-foreground text-sm">No channels yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {channels.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{c.description || "—"}</TableCell>
                        <TableCell>{c.member_count || 0}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

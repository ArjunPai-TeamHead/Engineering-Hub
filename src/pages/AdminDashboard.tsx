import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, ShoppingCart, GraduationCap, MessageSquare, Loader2, Ban, Eye, KeyRound, UserX, RotateCcw, Mail } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { courses } from "@/data/courses";

interface UserProfile {
  user_id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  skill_level: string | null;
  volts: number;
  created_at: string;
}

interface UserRole { user_id: string; role: string; }
interface UserBan { user_id: string; ban_type: string; reason: string; expires_at: string | null; }

const AdminDashboard = () => {
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [bans, setBans] = useState<UserBan[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [progressRows, setProgressRows] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, orders: 0, channels: 0, courses: 0 });
  const [loadingData, setLoadingData] = useState(true);

  // Detail dialog
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [banDialogUser, setBanDialogUser] = useState<UserProfile | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banType, setBanType] = useState<"suspension" | "permanent">("suspension");

  // Sensitive-data gate
  const [pinDialog, setPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [sensitive, setSensitive] = useState<any>(null);

  useEffect(() => {
    if (role === "admin") fetchAll();
  }, [role, loading]);

  const fetchAll = async () => {
    setLoadingData(true);
    const [profilesRes, rolesRes, bansRes, ordersRes, channelsRes, progressRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("user_bans").select("*"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("hive_channels").select("*"),
      supabase.from("course_progress").select("course_id, lesson_id, user_id, completed").limit(5000),
    ]);

    const profilesList = profilesRes.data || [];
    const rolesList = rolesRes.data || [];
    const ordersList = ordersRes.data || [];
    const channelsList = channelsRes.data || [];
    const progressList = progressRes.data || [];
    const uniqueCourses = new Set(progressList.map((p: any) => p.course_id));

    setUsers(profilesList);
    setRoles(rolesList);
    setBans(bansRes.data || []);
    setOrders(ordersList);
    setChannels(channelsList);
    setProgressRows(progressList);
    setStats({
      users: profilesList.length,
      orders: ordersList.length,
      channels: channelsList.length,
      courses: uniqueCourses.size,
    });
    setLoadingData(false);
  };

  const getUserRole = (userId: string) => roles.find((r) => r.user_id === userId)?.role || "apprentice";
  const getUserBan = (userId: string) => bans.find((b) => b.user_id === userId);

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

  const submitBan = async () => {
    if (!banDialogUser || !banReason.trim()) return;
    const { data: { user: me } } = await supabase.auth.getUser();
    if (!me) return;
    const expiresAt = banType === "suspension"
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : null;
    const { error } = await supabase.from("user_bans").insert({
      user_id: banDialogUser.user_id,
      ban_type: banType,
      reason: banReason.trim(),
      banned_by: me.id,
      expires_at: expiresAt,
    });
    if (error) {
      toast({ title: "Ban failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: banType === "permanent" ? "User banned" : "User suspended (7 days)" });
      setBanDialogUser(null);
      setBanReason("");
      setBanType("suspension");
      fetchAll();
    }
  };

  const liftBan = async (userId: string) => {
    const { error } = await supabase.from("user_bans").delete().eq("user_id", userId);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ban lifted" });
      setBans((prev) => prev.filter((b) => b.user_id !== userId));
    }
  };

  const fetchSensitive = async () => {
    if (!selectedUser) return;
    setPinLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-sensitive`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pin, target_user_id: selectedUser.user_id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast({ title: "Access denied", description: data.error || "Invalid pin", variant: "destructive" });
      } else {
        setSensitive(data);
        setPinDialog(false);
        setPin("");
      }
    } catch (e) {
      toast({ title: "Connection error", variant: "destructive" });
    } finally {
      setPinLoading(false);
    }
  };

  const userCourseProgress = (userId: string) => {
    const map: Record<string, Set<string>> = {};
    progressRows.filter((p) => p.user_id === userId && p.completed).forEach((p) => {
      if (!map[p.course_id]) map[p.course_id] = new Set();
      map[p.course_id].add(p.lesson_id);
    });
    return courses
      .map((c) => ({
        course: c,
        completed: map[c.id]?.size || 0,
        total: c.lessons.length,
      }))
      .filter((x) => x.completed > 0);
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
        <div className="rounded-2xl bg-destructive/10 p-2">
          <Shield className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Platform management, user controls & analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="rounded-2xl">
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
        <TabsList className="rounded-full">
          <TabsTrigger value="users" className="rounded-full"><Users className="h-4 w-4 mr-1" />Users</TabsTrigger>
          <TabsTrigger value="orders" className="rounded-full"><ShoppingCart className="h-4 w-4 mr-1" />Orders</TabsTrigger>
          <TabsTrigger value="bans" className="rounded-full"><Ban className="h-4 w-4 mr-1" />Bans ({bans.length})</TabsTrigger>
          <TabsTrigger value="channels" className="rounded-full"><MessageSquare className="h-4 w-4 mr-1" />Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>All Users ({users.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Volts</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const ban = getUserBan(u.user_id);
                    return (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">{u.display_name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">@{u.username || "—"}</TableCell>
                        <TableCell>{u.volts}</TableCell>
                        <TableCell>
                          <Select value={getUserRole(u.user_id)} onValueChange={(v) => updateUserRole(u.user_id, v)}>
                            <SelectTrigger className="w-32 h-8 rounded-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apprentice">Apprentice</SelectItem>
                              <SelectItem value="journeyman">Journeyman</SelectItem>
                              <SelectItem value="master">Master</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {ban ? (
                            <Badge variant="destructive" className="rounded-full text-[10px]">{ban.ban_type}</Badge>
                          ) : (
                            <Badge variant="outline" className="rounded-full text-[10px]">active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => { setSelectedUser(u); setSensitive(null); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {ban ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary" onClick={() => liftBan(u.user_id)}>
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive" onClick={() => setBanDialogUser(u)}>
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="rounded-2xl">
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
                      <TableHead>Payment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}</TableCell>
                        <TableCell><Badge variant={o.status === "completed" ? "default" : "secondary"} className="rounded-full">{o.status}</Badge></TableCell>
                        <TableCell className="text-xs capitalize">{o.payment_method || "—"}</TableCell>
                        <TableCell className="font-mono">₹{o.total_amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bans">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>Active Bans & Suspensions</CardTitle></CardHeader>
            <CardContent>
              {bans.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active bans.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bans.map((b) => {
                      const u = users.find((x) => x.user_id === b.user_id);
                      return (
                        <TableRow key={b.user_id}>
                          <TableCell className="font-medium">{u?.display_name || b.user_id.slice(0, 8)}</TableCell>
                          <TableCell><Badge variant="destructive" className="rounded-full">{b.ban_type}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{b.reason}</TableCell>
                          <TableCell className="text-xs">{b.expires_at ? new Date(b.expires_at).toLocaleDateString() : "Never"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="rounded-full text-primary" onClick={() => liftBan(b.user_id)}>
                              <RotateCcw className="h-3 w-3 mr-1" />Lift
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card className="rounded-2xl">
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

      {/* USER DETAIL DIALOG */}
      <Dialog open={!!selectedUser} onOpenChange={(o) => { if (!o) { setSelectedUser(null); setSensitive(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedUser.display_name}
                  <Badge variant="outline" className="rounded-full text-xs">@{selectedUser.username || "—"}</Badge>
                </DialogTitle>
                <DialogDescription>
                  Joined {new Date(selectedUser.created_at).toLocaleDateString()} · {selectedUser.volts} Volts · Role: {getUserRole(selectedUser.user_id)}
                </DialogDescription>
              </DialogHeader>

              {/* Course progress */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-500" /> Course Progress
                </h3>
                {userCourseProgress(selectedUser.user_id).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No course activity yet.</p>
                ) : (
                  <div className="space-y-2">
                    {userCourseProgress(selectedUser.user_id).map(({ course, completed, total }) => (
                      <div key={course.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground">{course.title}</span>
                          <span className="text-muted-foreground">{completed}/{total}</span>
                        </div>
                        <Progress value={(completed / total) * 100} className="h-1.5 rounded-full" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sensitive data gate */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <KeyRound className="h-4 w-4 text-destructive" /> Sensitive Information
                </h3>
                {!sensitive ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Email, phone, payment details, and order history are protected. Enter your admin pin to unlock.
                    </p>
                    <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => setPinDialog(true)}>
                      <KeyRound className="h-3 w-3" /> Unlock with Pin
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl bg-muted/40 p-3 space-y-1">
                      <p><Mail className="inline h-3 w-3 mr-1" /><span className="text-muted-foreground">Email:</span> <span className="font-mono">{sensitive.email || "—"}</span></p>
                      {sensitive.phone && <p><span className="text-muted-foreground">Phone:</span> <span className="font-mono">{sensitive.phone}</span></p>}
                      <p><span className="text-muted-foreground">Last sign-in:</span> {sensitive.last_sign_in_at ? new Date(sensitive.last_sign_in_at).toLocaleString() : "Never"}</p>
                    </div>
                    {sensitive.orders?.length > 0 && (
                      <div>
                        <p className="font-semibold text-foreground mb-1">Orders ({sensitive.orders.length})</p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {sensitive.orders.map((o: any) => (
                            <div key={o.id} className="flex justify-between rounded-lg bg-muted/40 px-2 py-1.5">
                              <span className="font-mono">{o.id.slice(0, 8)} · {o.status}</span>
                              <span className="font-mono">₹{o.total_amount?.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {sensitive.applications?.length > 0 && (
                      <div>
                        <p className="font-semibold text-foreground mb-1">Job Applications ({sensitive.applications.length})</p>
                        <div className="space-y-1">
                          {sensitive.applications.map((a: any) => (
                            <div key={a.id} className="flex justify-between rounded-lg bg-muted/40 px-2 py-1.5">
                              <span>{a.jobs?.title || "Job"}</span>
                              <Badge variant="outline" className="rounded-full text-[10px]">{a.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" className="rounded-full" onClick={() => { setSelectedUser(null); setSensitive(null); }}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* PIN DIALOG */}
      <Dialog open={pinDialog} onOpenChange={setPinDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Admin Pin Required</DialogTitle>
            <DialogDescription>
              Enter the sensitive-data pin to view personal details and order history.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-xl font-mono"
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") fetchSensitive(); }}
          />
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => { setPinDialog(false); setPin(""); }}>Cancel</Button>
            <Button className="rounded-full" onClick={fetchSensitive} disabled={pinLoading || !pin}>
              {pinLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unlock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BAN DIALOG */}
      <Dialog open={!!banDialogUser} onOpenChange={(o) => { if (!o) { setBanDialogUser(null); setBanReason(""); } }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <UserX className="h-5 w-5" /> Ban / Suspend User
            </DialogTitle>
            <DialogDescription>
              Restrict <span className="font-semibold text-foreground">{banDialogUser?.display_name}</span> from the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground">Type</label>
              <Select value={banType} onValueChange={(v: any) => setBanType(v)}>
                <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="suspension">Suspension (7 days)</SelectItem>
                  <SelectItem value="permanent">Permanent ban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Reason</label>
              <Textarea
                placeholder="e.g., spamming the Hive, abuse, repeated violations..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="rounded-xl mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setBanDialogUser(null)}>Cancel</Button>
            <Button variant="destructive" className="rounded-full" onClick={submitBan} disabled={!banReason.trim()}>
              {banType === "permanent" ? "Ban Permanently" : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

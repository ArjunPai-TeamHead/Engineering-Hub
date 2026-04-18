import { useState, useRef, useEffect } from "react";
import { Settings as SettingsIcon, User, Palette, Shield, Save, Loader2, Camera, Lock, Briefcase, KeyRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";

const Settings = () => {
  const { profile, refreshProfile, signOut, user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [githubUsername, setGithubUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync local state with profile when it loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setSkillLevel(profile.skill_level || "beginner");
      setGithubUsername(profile.github_username || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  // Resolve signed URL for avatar display
  useEffect(() => {
    const resolveAvatar = async () => {
      if (!avatarUrl) { setResolvedAvatarUrl(""); return; }
      if (avatarUrl.startsWith("http")) { setResolvedAvatarUrl(avatarUrl); return; }
      const { data } = await supabase.storage.from("user-files").createSignedUrl(avatarUrl, 3600);
      if (data?.signedUrl) setResolvedAvatarUrl(data.signedUrl);
    };
    resolveAvatar();
  }, [avatarUrl]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Avatar must be under 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("user-files").upload(filePath, file, { upsert: true, cacheControl: "3600" });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    setAvatarUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: filePath }).eq("user_id", user.id);
    await refreshProfile();
    toast({ title: "Avatar updated!" });
    setUploading(false);
  };

  const saveProfile = async () => {
    if (!profile || !user) return;
    setSaving(true);
    const updates: any = {
      display_name: displayName.trim(),
      bio: bio.trim(),
      skill_level: skillLevel,
      github_username: githubUsername.trim(),
    };
    if (username.trim() && username.trim() !== profile.username) {
      // Check uniqueness
      const { data: existing } = await supabase.from("profiles").select("user_id").eq("username", username.trim()).neq("user_id", user.id).maybeSingle();
      if (existing) {
        toast({ title: "Username taken", description: "Please choose another.", variant: "destructive" });
        setSaving(false);
        return;
      }
      updates.username = username.trim();
    }

    const { error } = await supabase.from("profiles").update(updates).eq("user_id", profile.user_id);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!user) return;
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast({ title: "Weak password", description: "Use letters and at least one number.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    // Re-auth to verify current password
    const { error: signinError } = await supabase.auth.signInWithPassword({ email: user.email!, password: currentPassword });
    if (signinError) {
      toast({ title: "Current password is wrong", variant: "destructive" });
      setChangingPassword(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password changed!" });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-primary/10 p-2.5">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4 rounded-2xl">
          <TabsTrigger value="profile" className="rounded-xl"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl"><Lock className="h-4 w-4 mr-1" /> Security</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl"><Palette className="h-4 w-4 mr-1" /> Appearance</TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-xl" asChild>
            <Link to="/settings/jobs"><Briefcase className="h-4 w-4 mr-1" /> Jobs</Link>
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-xl"><Shield className="h-4 w-4 mr-1" /> Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="h-20 w-20">
                    {resolvedAvatarUrl && <AvatarImage src={resolvedAvatarUrl} />}
                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                      {displayName?.slice(0, 2).toUpperCase() || "EN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" /> : <Camera className="h-5 w-5 text-primary-foreground" />}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile Picture</p>
                  <p className="text-xs text-muted-foreground">Click to upload (max 5MB)</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="your_username" className="rounded-xl" />
                <p className="text-[10px] text-muted-foreground">Lowercase letters, numbers, and underscores only.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>GitHub Username</Label>
                <Input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="octocat" className="rounded-xl" />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="rounded-xl bg-primary hover:bg-primary/90">
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" /> Change Password</CardTitle>
              <CardDescription>Use a strong password with letters and numbers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" className="rounded-xl" />
                <p className="text-[10px] text-muted-foreground">Minimum 8 characters with at least 1 letter and 1 number.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" className="rounded-xl" />
              </div>
              <Button onClick={changePassword} disabled={changingPassword || !currentPassword || !newPassword} className="rounded-xl">
                {changingPassword ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize your visual experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Currently using {theme} mode</p>
                </div>
                <Button variant="outline" onClick={toggle} className="rounded-xl">Switch to {theme === "dark" ? "Light" : "Dark"}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-mono text-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
                <div>
                  <p className="font-medium text-foreground">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
                <Button variant="destructive" className="rounded-xl" onClick={async () => {
                  await signOut();
                  navigate("/", { replace: true });
                  // Force a reload to clear all in-memory state cleanly
                  setTimeout(() => window.location.reload(), 50);
                }}>Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

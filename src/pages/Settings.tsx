import { useState, useRef, useEffect } from "react";
import { Settings as SettingsIcon, User, Palette, Shield, Save, Loader2, Camera } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { profile, refreshProfile, signOut, user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [skillLevel, setSkillLevel] = useState(profile?.skill_level || "beginner");
  const [githubUsername, setGithubUsername] = useState(profile?.github_username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [resolvedAvatarUrl, setResolvedAvatarUrl] = useState<string>("");

  // Resolve signed URL for avatar display
  useEffect(() => {
    const resolveAvatar = async () => {
      if (!avatarUrl) { setResolvedAvatarUrl(""); return; }
      // If it's already a full URL (legacy), use as-is
      if (avatarUrl.startsWith("http")) { setResolvedAvatarUrl(avatarUrl); return; }
      const { data } = await supabase.storage.from("user-files").createSignedUrl(avatarUrl, 3600);
      if (data?.signedUrl) setResolvedAvatarUrl(data.signedUrl);
    };
    resolveAvatar();
  }, [avatarUrl]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("user-files").upload(filePath, file, { upsert: true });
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    // Store path, not public URL — bucket is private
    setAvatarUrl(filePath);
    await supabase.from("profiles").update({ avatar_url: filePath }).eq("user_id", user.id);
    await refreshProfile();
    toast({ title: "Avatar updated!" });
    setUploading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio, skill_level: skillLevel, github_username: githubUsername, avatar_url: avatarUrl })
      .eq("user_id", profile.user_id);
    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 glow-primary">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-1" /> Appearance</TabsTrigger>
          <TabsTrigger value="account"><Shield className="h-4 w-4 mr-1" /> Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar upload */}
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
                  <p className="text-xs text-muted-foreground">Click to upload a new avatar</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." />
              </div>
              <div className="space-y-1.5">
                <Label>Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Input value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="octocat" />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="bg-primary hover:bg-primary/90">
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                Save Changes
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
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Theme</p>
                  <p className="text-sm text-muted-foreground">Currently using {theme} mode</p>
                </div>
                <Button variant="outline" onClick={toggle}>Switch to {theme === "dark" ? "Light" : "Dark"}</Button>
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
              <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div>
                  <p className="font-medium text-foreground">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
                <Button variant="destructive" onClick={async () => { await signOut(); navigate("/signin"); }}>Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

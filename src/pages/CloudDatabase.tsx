import { useState, useEffect, useRef } from "react";
import { Database, Upload, FileText, Image, Code, Folder, Trash2, Download, Plus, Search, Loader2, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

interface UserFile {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string | null;
  content: string | null;
  file_size: number;
  folder: string;
  created_at: string;
  updated_at: string;
}

const typeIcons: Record<string, typeof FileText> = {
  text: FileText,
  code: Code,
  image: Image,
  file: File,
};

const CloudDatabase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [newFileType, setNewFileType] = useState("code");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadFiles();
  }, [user]);

  const loadFiles = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("user_files").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (data) setFiles(data as unknown as UserFile[]);
    setLoading(false);
  };

  const saveTextFile = async () => {
    if (!user || !newFileName.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("user_files").insert({
      user_id: user.id,
      file_name: newFileName.trim(),
      file_type: newFileType,
      content: newFileContent,
      file_size: new Blob([newFileContent]).size,
    } as any);
    if (error) toast({ title: "Error saving", description: error.message, variant: "destructive" });
    else {
      toast({ title: "File saved!" });
      setShowNewFile(false); setNewFileName(""); setNewFileContent("");
      loadFiles();
    }
    setSaving(false);
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("user-files").upload(filePath, file);
    if (uploadError) { toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" }); return; }
    // Store path, not public URL — bucket is private, use signed URLs at render
    
    const fileType = file.type.startsWith("image/") ? "image" : file.name.match(/\.(js|ts|tsx|py|cpp|c|h|ino|json|html|css)$/) ? "code" : "file";
    
    await supabase.from("user_files").insert({
      user_id: user.id,
      file_name: file.name,
      file_type: fileType,
      file_url: filePath,
      file_size: file.size,
    } as any);
    toast({ title: "File uploaded!" });
    loadFiles();
  };

  const deleteFile = async (id: string) => {
    await supabase.from("user_files").delete().eq("id", id);
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({ title: "File deleted" });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = files
    .filter(f => activeTab === "all" || f.file_type === activeTab)
    .filter(f => !search || f.file_name.toLowerCase().includes(search.toLowerCase()));

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="ios-card max-w-md text-center p-8">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground mb-2">Sign in to access Cloud Database</h2>
          <p className="text-sm text-muted-foreground mb-4">Save your code snippets, images, and files securely in the cloud.</p>
          <Button onClick={() => navigate("/signin")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-2.5">
            <Database className="h-6 w-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cloud Database</h1>
            <p className="text-muted-foreground">Save code, images, and files securely in the cloud</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={uploadFile} />
          <Button className="rounded-xl gap-2" onClick={() => setShowNewFile(true)}>
            <Plus className="h-4 w-4" /> New File
          </Button>
        </div>
      </div>

      {/* New file form */}
      {showNewFile && (
        <Card className="ios-card mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-3">
              <Input placeholder="File name (e.g. main.cpp)" value={newFileName} onChange={e => setNewFileName(e.target.value)} className="rounded-xl" />
              <select value={newFileType} onChange={e => setNewFileType(e.target.value)} className="rounded-xl border border-border bg-card px-3 text-sm">
                <option value="code">Code</option>
                <option value="text">Text</option>
              </select>
            </div>
            <Textarea placeholder="Paste your code or text here..." value={newFileContent} onChange={e => setNewFileContent(e.target.value)} className="min-h-[200px] font-mono text-sm rounded-xl" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowNewFile(false)}>Cancel</Button>
              <Button className="rounded-xl" onClick={saveTextFile} disabled={saving || !newFileName.trim()}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search + tabs */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-xl h-11" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">All ({files.length})</TabsTrigger>
          <TabsTrigger value="code" className="rounded-lg">Code</TabsTrigger>
          <TabsTrigger value="image" className="rounded-lg">Images</TabsTrigger>
          <TabsTrigger value="text" className="rounded-lg">Text</TabsTrigger>
          <TabsTrigger value="file" className="rounded-lg">Files</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card className="ios-card border-dashed">
          <CardContent className="py-12 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No files yet</h3>
            <p className="text-sm text-muted-foreground">Upload files or create new code snippets to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(file => {
            const Icon = typeIcons[file.file_type] || File;
            return (
              <Card key={file.id} className="ios-card group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2.5 shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{file.file_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] rounded-full">{file.file_type}</Badge>
                        <span className="text-[10px] text-muted-foreground">{formatSize(file.file_size)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(file.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.file_url && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={file.file_url} target="_blank" rel="noopener noreferrer"><Download className="h-3.5 w-3.5" /></a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteFile(file.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {/* Preview for images */}
                  {file.file_type === "image" && file.file_url && (
                    <img src={file.file_url} alt={file.file_name} className="mt-3 rounded-lg w-full h-32 object-cover border border-border" />
                  )}
                  {/* Preview for code */}
                  {file.file_type === "code" && file.content && (
                    <pre className="mt-3 rounded-lg bg-muted p-2.5 text-[11px] font-mono text-muted-foreground overflow-hidden max-h-24 line-clamp-4">{file.content}</pre>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CloudDatabase;

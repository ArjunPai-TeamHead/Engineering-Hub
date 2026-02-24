import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { roleDot } from "@/pages/Hive";

interface Props {
  profile: any;
  role: string | null;
}

const getInitials = (name: string) => name?.slice(0, 2).toUpperCase() || "EN";

export function HiveMemberList({ profile, role }: Props) {
  return (
    <div className="w-60 shrink-0 border-l border-[hsl(225,12%,14%)] bg-[hsl(225,22%,9%)] hidden lg:block">
      <ScrollArea className="h-full p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,50%)] mb-3">Online — {profile ? 1 : 0}</p>
        {profile && (
          <div className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-[hsl(225,15%,13%)] cursor-pointer">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`text-[10px] font-bold ${roleDot[role || "apprentice"]} text-white`}>
                  {getInitials(profile.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[hsl(225,22%,9%)] bg-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(210,20%,90%)]">{profile.display_name}</p>
              <p className="text-[11px] text-[hsl(220,10%,45%)] capitalize">{role || "apprentice"}</p>
            </div>
          </div>
        )}

        <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,50%)] mt-6 mb-3">Offline — 0</p>
      </ScrollArea>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Users, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n";

interface Friend {
  id: number;
  friendSteamId64: string;
  friendName: string | null;
  friendAvatarUrl: string | null;
  friendProfileUrl: string | null;
}

interface Profile {
  id: number;
  steamId64: string;
  name: string;
  avatarUrl: string | null;
  isOwner: boolean;
}

export default function Friends() {
  const { t } = useI18n();
  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { data: ownerProfile } = useQuery({
    queryKey: ["profiles", "owner"],
    queryFn: async () => {
      const res = await fetch(`${apiBase}/api/profiles/owner`);
      if (!res.ok) return null;
      return res.json() as Promise<Profile | null>;
    },
  });

  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", ownerProfile?.id],
    queryFn: async () => {
      if (!ownerProfile?.id) return [];
      const res = await fetch(`${apiBase}/api/profiles/${ownerProfile.id}/friends`);
      if (!res.ok) return [];
      return res.json() as Promise<Friend[]>;
    },
    enabled: !!ownerProfile?.id,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight gradient-text flex items-center gap-3">
          <Users className="w-7 h-7 shrink-0" style={{ color: '#7C3AED' }} />
          {t("friendsList")}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("friendsDesc")}</p>
      </div>

      {!ownerProfile && !isLoading && (
        <div className="p-10 text-center border border-dashed border-border rounded-md">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: '#A855F7' }} />
          <p className="text-muted-foreground text-sm">{t("noFriends")}</p>
        </div>
      )}

      {ownerProfile && (
        <>
          {/* Owner profile card */}
          <div className="p-4 rounded-lg border flex items-center gap-4" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.05))', borderColor: 'rgba(124,58,237,0.3)' }}>
            {ownerProfile.avatarUrl ? (
              <img src={ownerProfile.avatarUrl} alt={ownerProfile.name} className="w-12 h-12 rounded-full border-2" style={{ borderColor: '#7C3AED', boxShadow: '0 0 12px rgba(124,58,237,0.4)' }} />
            ) : (
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg" style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
                {ownerProfile.name[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-black text-white text-lg">{ownerProfile.name}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A855F7' }}>Seu perfil Steam</p>
            </div>
          </div>

          {/* Friends count */}
          {friends && friends.length > 0 && (
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {friends.length} amigos importados
            </div>
          )}

          {/* Friends grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4 flex items-center gap-3" style={{ background: '#14141C', borderColor: 'rgba(124,58,237,0.15)' }}>
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : friends && friends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="rounded-lg border p-4 flex items-center gap-3 transition-all duration-200 hover:border-opacity-60 card-glow"
                  style={{ background: '#14141C', borderColor: 'rgba(124,58,237,0.18)' }}
                >
                  {friend.friendAvatarUrl ? (
                    <img src={friend.friendAvatarUrl} alt={friend.friendName ?? ""} className="w-10 h-10 rounded-full shrink-0 border" style={{ borderColor: 'rgba(124,58,237,0.3)' }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0" style={{ background: 'rgba(124,58,237,0.2)', color: '#A855F7' }}>
                      {friend.friendName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-white truncate">{friend.friendName ?? "Steam User"}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{friend.friendSteamId64}</p>
                  </div>
                  {friend.friendProfileUrl && (
                    <a
                      href={friend.friendProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1.5 rounded-md transition-colors hover:bg-primary/20"
                      title={t("viewLibrary")}
                    >
                      <ExternalLink className="w-3.5 h-3.5" style={{ color: '#A855F7' }} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center border border-dashed border-border rounded-md">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: '#A855F7' }} />
              <p className="text-muted-foreground text-sm">{t("noFriends")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

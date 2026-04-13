import { Link, useLocation } from "wouter";
import { LayoutDashboard, PlusCircle, Activity, Download, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t, lang, setLang } = useI18n();

  const { data: health } = useHealthCheck({
    query: { queryKey: getHealthCheckQueryKey(), refetchInterval: 30000 }
  });
  const isHealthy = health?.status === "ok";

  const { data: ownerProfile } = useQuery({
    queryKey: ["profiles", "owner"],
    queryFn: async () => {
      const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${apiBase}/api/profiles/owner`);
      if (!res.ok) return null;
      return res.json() as Promise<{ name: string; avatarUrl?: string | null } | null>;
    },
    refetchInterval: 60000,
  });

  const NAV_ITEMS = [
    { path: "/", label: t("dashboard"), icon: LayoutDashboard },
    { path: "/games", label: t("library"), icon: Activity },
    { path: "/add", label: t("addGame"), icon: PlusCircle },
    { path: "/steam", label: t("steamImport"), icon: Download },
    { path: "/friends", label: t("friends"), icon: Users },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row" style={{ background: '#0B0B0F' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r shrink-0" style={{ background: '#14141C', borderColor: 'rgba(124,58,237,0.15)' }}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-2 border-b" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
          <img src="/logo.png" alt="VaultGG" className="h-8 w-auto" />
        </div>

        {/* Profile */}
        {ownerProfile && (
          <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
            {ownerProfile.avatarUrl ? (
              <img src={ownerProfile.avatarUrl} alt={ownerProfile.name} className="w-8 h-8 rounded-full border-2" style={{ borderColor: '#7C3AED' }} />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)' }}>
                {ownerProfile.name[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{ownerProfile.name}</p>
              <p className="text-[10px] text-muted-foreground">Steam</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold transition-all duration-200 uppercase tracking-[0.08em]",
                  isActive ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.08))',
                  borderLeft: '2px solid #7C3AED',
                  paddingLeft: 'calc(0.75rem - 2px)',
                  boxShadow: '0 0 12px rgba(124,58,237,0.15)',
                } : {}}
              >
                <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? '#A855F7' : undefined }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: status + language toggle */}
        <div className="p-4 border-t space-y-3" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
          {/* Language toggle */}
          <div className="flex items-center gap-1 p-1 rounded-md" style={{ background: '#0B0B0F' }}>
            <button
              onClick={() => setLang("pt-BR")}
              className="flex-1 py-1 text-[10px] font-black rounded uppercase tracking-widest transition-all"
              style={{
                background: lang === "pt-BR" ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'transparent',
                color: lang === "pt-BR" ? 'white' : '#71717A',
              }}
            >
              PT
            </button>
            <button
              onClick={() => setLang("en")}
              className="flex-1 py-1 text-[10px] font-black rounded uppercase tracking-widest transition-all"
              style={{
                background: lang === "en" ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'transparent',
                color: lang === "en" ? 'white' : '#71717A',
              }}
            >
              EN
            </button>
          </div>
          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: isHealthy ? '#22C55E' : '#EF4444', boxShadow: isHealthy ? '0 0 6px rgba(34,197,94,0.8)' : '0 0 6px rgba(239,68,68,0.8)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: isHealthy ? '#22C55E' : '#EF4444' }}>
              {isHealthy ? t("online") : t("offline")}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-[15%] -left-[5%] w-[40%] h-[40%] rounded-full blur-[150px] opacity-10" style={{ background: '#7C3AED' }} />
          <div className="absolute top-[55%] -right-[8%] w-[35%] h-[35%] rounded-full blur-[150px] opacity-8" style={{ background: '#A855F7' }} />
        </div>
        <div className="flex-1 overflow-y-auto relative z-10 p-5 md:p-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-50 border-t" style={{ background: '#14141C', borderColor: 'rgba(124,58,237,0.2)' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
              <Icon className="w-5 h-5" style={{ color: isActive ? '#A855F7' : '#71717A', filter: isActive ? 'drop-shadow(0 0 6px rgba(168,85,247,0.8))' : undefined }} />
              <span className="text-[8px] uppercase font-black tracking-widest" style={{ color: isActive ? '#A855F7' : '#71717A' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

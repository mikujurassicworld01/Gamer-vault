import { useState } from "react";
import { useLocation } from "wouter";
import { useImportSteamProfile, getListGamesQueryKey, getGetDashboardStatsQueryKey, getGetGamerScoreQueryKey, getGetInsightsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, AlertTriangle, ExternalLink, Gamepad2 } from "lucide-react";

export default function SteamImport() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const importSteam = useImportSteamProfile();

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    importSteam.mutate(
      { data: { steamProfileUrl: url } },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGamerScoreQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });

          toast({
            title: "Steam Import Complete",
            description: `${result.imported} new games imported. ${result.skipped} already in vault.`,
          });

          setTimeout(() => setLocation("/games"), 1800);
        },
        onError: (err: unknown) => {
          const message = (() => {
            if (err && typeof err === "object" && "message" in err) {
              const m = (err as { message?: string }).message;
              if (m) return m;
            }
            return "Steam import failed. Check the profile URL and privacy settings.";
          })();
          toast({ title: "Import Failed", description: message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight gradient-text flex items-center gap-3">
          <Download className="w-7 h-7 shrink-0" style={{ color: '#7C3AED' }} />
          Steam Import
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Connect your Steam account to automatically import your library, playtime, and prices.
        </p>
      </div>

      {/* Privacy Warning */}
      <div
        className="rounded-md border p-4 flex gap-3"
        style={{ background: 'rgba(250,204,21,0.06)', borderColor: 'rgba(250,204,21,0.25)' }}
      >
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#FACC15' }} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FACC15' }}>Privacy Settings Required</p>
          <p className="text-sm text-muted-foreground">
            Your Steam profile and game details must be set to <strong className="text-foreground">Public</strong>.
            Go to <strong className="text-foreground">Steam</strong> &rarr; <strong className="text-foreground">Edit Profile</strong> &rarr; <strong className="text-foreground">Privacy Settings</strong> and set "My Profile" and "Game Details" to Public.
          </p>
          <a
            href="https://steamcommunity.com/my/edit/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-2 font-bold hover:underline"
            style={{ color: '#FACC15' }}
          >
            Open Steam Privacy Settings
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Import Form */}
      <div
        className="rounded-lg border p-6 relative overflow-hidden"
        style={{ background: '#14141C', borderColor: 'rgba(124,58,237,0.25)' }}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: '#7C3AED' }} />

        <h2 className="font-black uppercase tracking-widest text-xs mb-6" style={{ color: '#A855F7' }}>
          Profile URL or Steam ID
        </h2>

        <form onSubmit={handleImport} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Steam Profile URL / Custom URL / Steam ID64
            </label>
            <Input
              placeholder="https://steamcommunity.com/id/yourusername"
              className="h-12 text-sm font-mono border"
              style={{
                background: '#1F1F2A',
                borderColor: 'rgba(124,58,237,0.3)',
                color: '#F5F5F5',
              }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={importSteam.isPending || importSteam.isSuccess}
            />
            <p className="text-[11px] text-muted-foreground">
              Examples: <span className="font-mono text-accent/70">steamcommunity.com/id/gaben</span> or <span className="font-mono text-accent/70">76561197960287930</span>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-black uppercase tracking-widest text-sm border-0 text-white transition-all duration-200"
            style={{
              background: importSteam.isSuccess
                ? 'rgba(34,197,94,0.2)'
                : 'linear-gradient(135deg, #7C3AED, #A855F7)',
              boxShadow: importSteam.isPending || importSteam.isSuccess
                ? 'none'
                : '0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.15)',
              color: importSteam.isSuccess ? '#22C55E' : 'white',
            }}
            disabled={importSteam.isPending || importSteam.isSuccess || !url.trim()}
          >
            {importSteam.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Fetching from Steam...
              </span>
            ) : importSteam.isSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Import Complete — Redirecting
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Import Steam Library
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Success Result */}
      {importSteam.isSuccess && importSteam.data && (
        <div
          className="rounded-lg border p-6 animate-in slide-in-from-bottom-4 duration-400 text-center"
          style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.25)' }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.15)', boxShadow: '0 0 20px rgba(34,197,94,0.3)' }}>
            <CheckCircle2 className="w-7 h-7" style={{ color: '#22C55E' }} />
          </div>
          <h3 className="font-black text-lg text-white mb-2">
            {importSteam.data.profileName ? `Welcome, ${importSteam.data.profileName}!` : "Import Successful!"}
          </h3>
          <p className="text-muted-foreground text-sm">
            <span className="font-black text-white">{importSteam.data.imported}</span> games added to your vault.{" "}
            {importSteam.data.skipped > 0 && (
              <span>{importSteam.data.skipped} were already in your library.</span>
            )}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Gamepad2 className="w-3.5 h-3.5" style={{ color: '#A855F7' }} />
            <span>Redirecting to your library...</span>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">How it works</h3>
        <div className="grid gap-3">
          {[
            { step: "01", text: "We extract your Steam ID from the URL" },
            { step: "02", text: "We fetch your full game library via the Steam Web API" },
            { step: "03", text: "Real prices are pulled from the Steam Store" },
            { step: "04", text: "Your vault is populated with real data — no guessing" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="text-xs font-black font-mono shrink-0" style={{ color: '#7C3AED' }}>{step}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

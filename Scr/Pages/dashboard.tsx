import { useGetDashboardStats, getGetDashboardStatsQueryKey, useGetGamerScore, getGetGamerScoreQueryKey, useGetInsights, getGetInsightsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Clock, Gamepad2, Coins, AlertCircle, CheckCircle2, Info, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";

export default function Dashboard() {
  const { t, lang } = useI18n();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() }
  });
  const { data: scoreData, isLoading: scoreLoading } = useGetGamerScore({
    query: { queryKey: getGetGamerScoreQueryKey() }
  });
  const { data: insightsData, isLoading: insightsLoading } = useGetInsights({
    query: { queryKey: getGetInsightsQueryKey() }
  });

  const showBrl = lang === "pt-BR";

  const formatValue = (usd: number | undefined, brl: number | undefined) => {
    if (showBrl && brl) return `R$ ${brl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${(usd ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const tierLabel = (tier: string | undefined) => {
    if (!tier) return t("unranked");
    return t(`tier_${tier}` as "tier_Casual") || tier;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight gradient-text">{t("commandCenter")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("commandCenterDesc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gamer Score Card */}
        <div className="col-span-1 lg:col-span-1">
          <Card className="border-[rgba(124,58,237,0.3)] bg-card relative overflow-hidden card-glow h-full animate-pulse-glow" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, #14141C 60%)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
            </div>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[260px] relative z-10">
              {scoreLoading ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <Skeleton className="w-36 h-36 rounded-full" />
                  <Skeleton className="w-24 h-7" />
                </div>
              ) : (
                <>
                  <h3 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-6">{t("gamerScore")}</h3>
                  <ScoreRing score={scoreData?.score ?? 0} label={t("score")} />
                  <div className="mt-6 px-5 py-1.5 rounded-full border border-primary/40 bg-primary/10 font-black uppercase tracking-[0.15em] text-sm box-glow-primary" style={{ color: '#A855F7' }}>
                    {tierLabel(scoreData?.tier)}
                  </div>
                  {scoreData?.breakdown && (
                    <div className="mt-4 w-full grid grid-cols-2 gap-1.5 text-[10px]">
                      <BreakdownPill label={t("completion")} value={scoreData.breakdown.completionBonus} />
                      <BreakdownPill label={t("achievements")} value={scoreData.breakdown.achievementsBonus} />
                      <BreakdownPill label={t("hours")} value={scoreData.breakdown.hoursBonus} />
                      <BreakdownPill label={t("library")} value={scoreData.breakdown.librarySize} />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Core Stats Grid */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            title={t("accountValue")}
            value={statsLoading ? null : formatValue(stats?.accountValue, stats?.accountValueBrl)}
            icon={Coins}
            colorClass="text-accent"
            glowClass="text-glow-accent"
            accent="#A855F7"
          />
          <StatCard
            title={t("totalGames")}
            value={statsLoading ? null : stats?.totalGames}
            icon={Gamepad2}
            colorClass="text-primary"
            glowClass="text-glow-primary"
            accent="#7C3AED"
          />
          <StatCard
            title={t("hoursPlayed")}
            value={statsLoading ? null : `${Math.round(stats?.totalHoursPlayed ?? 0).toLocaleString()}h`}
            icon={Clock}
            colorClass="text-[#22C55E]"
            glowClass="text-glow-secondary"
            accent="#22C55E"
          />
          <StatCard
            title={t("achievements")}
            value={statsLoading ? null : `${stats?.unlockedAchievements ?? 0} / ${stats?.totalAchievements ?? 0}`}
            icon={Trophy}
            colorClass="text-[#FACC15]"
            glowClass="text-glow-warning"
            accent="#FACC15"
          />
        </div>
      </div>

      {/* Extra Stats Row */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStat label={t("completedGames")} value={stats.completedGames} color="#22C55E" />
          <MiniStat label={t("avgProgress")} value={`${stats.averageProgress}%`} color="#A855F7" />
          <MiniStat label={t("platforms")} value={Object.keys(stats.gamesByPlatform).length} color="#7C3AED" />
          <MiniStat label={t("accountRating")} value={insightsData?.accountValueRating ?? "—"} color="#FACC15" />
        </div>
      )}

      {/* Insights */}
      <div className="space-y-4">
        <h2 className="text-base font-bold uppercase tracking-[0.15em] border-b border-border pb-3 flex items-center gap-2" style={{ color: '#A855F7' }}>
          <Star className="w-4 h-4" />
          {t("smartInsights")}
        </h2>
        {insightsLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="w-full h-14" />)}
          </div>
        ) : insightsData?.messages && insightsData.messages.length > 0 ? (
          <div className="grid gap-3">
            {insightsData.messages.map((insight, idx) => {
              const { icon: Icon, bg, border, textColor } = getInsightStyles(insight.type);
              return (
                <div key={idx} className="p-4 rounded-md border flex items-start gap-3 transition-all duration-200" style={{ background: bg, borderColor: border }}>
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: textColor }} />
                  <p className="text-sm font-medium" style={{ color: textColor }}>{insight.message}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center border border-dashed border-border rounded-md text-muted-foreground text-sm">
            {t("noInsights")}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const [animated, setAnimated] = useState(0);
  const circumference = 2 * Math.PI * 45;
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 100); return () => clearTimeout(t); }, [score]);
  const dashArray = (animated / 100) * circumference;
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="7" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#sg)" strokeWidth="7" strokeDasharray={`${dashArray} ${circumference}`} strokeLinecap="round" className="score-ring-fill" />
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-black text-white text-glow-primary tabular-nums">{Math.round(score)}</span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">{label}</span>
      </div>
    </div>
  );
}

function BreakdownPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded bg-primary/5 border border-primary/10">
      <span className="text-muted-foreground truncate">{label}</span>
      <span className="font-bold text-accent ml-1">+{value}</span>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, colorClass, glowClass, accent }: {
  title: string; value: React.ReactNode; icon: React.ComponentType<{ className?: string }>;
  colorClass: string; glowClass?: string; accent: string;
}) {
  return (
    <Card className="bg-card border-border/50 card-glow overflow-hidden relative" style={{ borderColor: `${accent}20` }}>
      <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20" style={{ background: accent }} />
      <CardContent className="p-5 flex flex-col justify-center h-full relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{title}</span>
        </div>
        {value === null ? (
          <Skeleton className="w-24 h-9 mt-1" />
        ) : (
          <div className={cn("text-2xl font-black text-white font-mono leading-none", glowClass)}>{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  return (
    <div className="rounded-md border border-border/40 bg-card p-3 text-center">
      <div className="text-lg font-black font-mono" style={{ color }}>{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-0.5">{label}</div>
    </div>
  );
}

function getInsightStyles(type: string) {
  switch (type) {
    case "positive": return { icon: CheckCircle2, bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.25)", textColor: "#22C55E" };
    case "warning": return { icon: AlertCircle, bg: "rgba(250,204,21,0.06)", border: "rgba(250,204,21,0.25)", textColor: "#FACC15" };
    default: return { icon: Info, bg: "rgba(124,58,237,0.06)", border: "rgba(124,58,237,0.25)", textColor: "#A855F7" };
  }
}

import { useState } from "react";
import { useListGames, getListGamesQueryKey, useDeleteGame } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Search, Trash2, Edit, Monitor, Disc, Coins, AlertTriangle, Clock, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function GamesList() {
  const { data: games, isLoading } = useListGames({
    query: { queryKey: getListGamesQueryKey() }
  });
  
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteGame = useDeleteGame();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      deleteGame.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
          toast({ title: "Game deleted", variant: "default" });
        },
        onError: () => {
          toast({ title: "Failed to delete game", variant: "destructive" });
        }
      });
    }
  };

  const filteredGames = games?.filter(game => {
    if (search && !game.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (platformFilter !== "all" && game.platform !== platformFilter) return false;
    if (typeFilter !== "all" && game.gameType !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white">Game Library</h1>
          <p className="text-muted-foreground mt-1">Browse and manage your entire collection.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search games..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/50 focus:ring-primary">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="steam">Steam</SelectItem>
            <SelectItem value="epic">Epic Games</SelectItem>
            <SelectItem value="gog">GOG</SelectItem>
            <SelectItem value="xbox">Xbox</SelectItem>
            <SelectItem value="playstation">PlayStation</SelectItem>
            <SelectItem value="emulator">Emulator</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-background/50 border-border/50 focus:ring-primary">
            <SelectValue placeholder="Game Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
            <SelectItem value="free">Free to Play</SelectItem>
            <SelectItem value="pirated">Pirated</SelectItem>
            <SelectItem value="emulator">Emulator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardHeader className="pb-2"><Skeleton className="w-2/3 h-6" /></CardHeader>
              <CardContent><Skeleton className="w-full h-24" /></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredGames?.length === 0 ? (
        <div className="text-center py-20 bg-card/30 rounded-lg border border-dashed border-border flex flex-col items-center">
          <Gamepad2 className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
          <p className="text-muted-foreground">Adjust your filters or add a new game.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames?.map(game => (
            <Card key={game.id} className="bg-card border-border/50 hover:border-primary/50 transition-colors group relative overflow-hidden flex flex-col">
              {game.progressPercent === 100 && (
                <div className="absolute -right-10 top-4 bg-accent/20 text-accent text-[10px] font-bold px-10 py-1 rotate-45 uppercase tracking-widest border-y border-accent/30 box-glow-accent z-10">
                  Completed
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate pr-4">
                    {game.name}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 -mt-2 shrink-0"
                    onClick={() => handleDelete(game.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <PlatformBadge platform={game.platform} />
                  <TypeBadge type={game.gameType} />
                  {game.gameType === "emulator" && game.emulatorName && (
                    <Badge variant="outline" className="bg-background/50 border-muted text-muted-foreground">
                      {game.emulatorName}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-1">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase">
                      <span>Progress</span>
                      <span className={game.progressPercent === 100 ? "text-accent" : "text-white"}>{game.progressPercent}%</span>
                    </div>
                    <Progress 
                      value={game.progressPercent} 
                      className="h-2 bg-background" 
                      indicatorClassName={game.progressPercent === 100 ? "bg-accent" : "bg-primary"}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{game.hoursPlayed || 0}h</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span>{game.achievementsUnlocked || 0}/{game.achievementsTotal || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center border-t border-border/50 mt-auto bg-background/20 p-4">
                <div className="flex items-center gap-2">
                  {game.gameType === "purchased" ? (
                    <>
                      <Coins className="w-4 h-4 text-secondary" />
                      <span className="font-bold text-white">${game.estimatedValue?.toFixed(2) || "0.00"}</span>
                    </>
                  ) : (
                    <span className="text-xs uppercase font-bold text-muted-foreground">No Value</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground/50">
                  {format(new Date(game.createdAt), "MMM d, yyyy")}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const config: Record<string, { icon: typeof Monitor, label: string, style: React.CSSProperties }> = {
    steam: { icon: Monitor, label: "Steam", style: { background: 'rgba(124,58,237,0.15)', color: '#A78BFA', borderColor: 'rgba(124,58,237,0.3)' } },
    epic: { icon: Monitor, label: "Epic", style: { background: 'rgba(161,161,170,0.1)', color: '#A1A1AA', borderColor: 'rgba(161,161,170,0.25)' } },
    gog: { icon: Disc, label: "GOG", style: { background: 'rgba(168,85,247,0.1)', color: '#A855F7', borderColor: 'rgba(168,85,247,0.25)' } },
    xbox: { icon: Gamepad2, label: "Xbox", style: { background: 'rgba(34,197,94,0.1)', color: '#22C55E', borderColor: 'rgba(34,197,94,0.25)' } },
    playstation: { icon: Gamepad2, label: "PS", style: { background: 'rgba(59,130,246,0.1)', color: '#60A5FA', borderColor: 'rgba(59,130,246,0.25)' } },
    emulator: { icon: AlertTriangle, label: "Emu", style: { background: 'rgba(250,204,21,0.1)', color: '#FACC15', borderColor: 'rgba(250,204,21,0.25)' } },
    other: { icon: Disc, label: "Other", style: { background: 'rgba(71,71,85,0.2)', color: '#71717A', borderColor: 'rgba(71,71,85,0.3)' } },
  };

  const c = config[platform] ?? config.other;
  const Icon = c.icon;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border" style={c.style}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; style: React.CSSProperties }> = {
    purchased: { label: "Purchased", style: { background: 'rgba(34,197,94,0.12)', color: '#22C55E', borderColor: 'rgba(34,197,94,0.3)' } },
    free: { label: "Free", style: { background: 'rgba(250,204,21,0.1)', color: '#FACC15', borderColor: 'rgba(250,204,21,0.25)' } },
    pirated: { label: "Pirated", style: { background: 'rgba(239,68,68,0.1)', color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' } },
    emulator: { label: "Emulator", style: { background: 'rgba(168,85,247,0.1)', color: '#A855F7', borderColor: 'rgba(168,85,247,0.25)' } },
  };

  const c = config[type] ?? config.free;

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border" style={c.style}>
      {c.label}
    </span>
  );
}

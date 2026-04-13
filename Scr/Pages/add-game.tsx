import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useCreateGame } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListGamesQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Save, Gamepad2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Game name is required"),
  platform: z.enum(["steam", "epic", "gog", "xbox", "playstation", "emulator", "other"]),
  gameType: z.enum(["purchased", "free", "pirated", "emulator"]),
  progressPercent: z.number().min(0).max(100),
  hoursPlayed: z.number().min(0).optional(),
  estimatedValue: z.number().min(0).optional(),
  achievementsTotal: z.number().min(0).optional(),
  achievementsUnlocked: z.number().min(0).optional(),
  emulatorName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddGame() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createGame = useCreateGame();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      platform: "steam",
      gameType: "purchased",
      progressPercent: 0,
      hoursPlayed: 0,
      estimatedValue: 0,
      achievementsTotal: 0,
      achievementsUnlocked: 0,
      emulatorName: "",
    },
  });

  const isEmulatorType = form.watch("gameType") === "emulator";

  const onSubmit = (data: FormValues) => {
    createGame.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
        toast({ title: "Game Added", description: "Successfully added to your vault.", variant: "default" });
        setLocation("/games");
      },
      onError: (err) => {
        toast({ title: "Failed to add game", description: err?.message || "An error occurred", variant: "destructive" });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          Add to Vault
        </h1>
        <p className="text-muted-foreground mt-1">Manually enter a game into your collection.</p>
      </div>

      <Card className="bg-card border-border/50 shadow-xl shadow-black/50">
        <CardHeader className="border-b border-border/50 bg-background/30 pb-4">
          <CardTitle className="text-lg">Game Details</CardTitle>
          <CardDescription>Enter the specifics of your game to track value and progress.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cyberpunk 2077" className="bg-background/50 border-border/50 focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="steam">Steam</SelectItem>
                          <SelectItem value="epic">Epic Games</SelectItem>
                          <SelectItem value="gog">GOG</SelectItem>
                          <SelectItem value="xbox">Xbox</SelectItem>
                          <SelectItem value="playstation">PlayStation</SelectItem>
                          <SelectItem value="emulator">Emulator</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gameType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Acquisition Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="purchased">Purchased</SelectItem>
                          <SelectItem value="free">Free to Play</SelectItem>
                          <SelectItem value="pirated">Pirated</SelectItem>
                          <SelectItem value="emulator">Emulator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isEmulatorType && (
                <FormField
                  control={form.control}
                  name="emulatorName"
                  render={({ field }) => (
                    <FormItem className="animate-in slide-in-from-top-2 duration-200">
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-warning">Emulator Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Yuzu, RPCS3, PCSX2" className="bg-background/50 border-warning/30 focus-visible:ring-warning" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="progressPercent"
                render={({ field }) => (
                  <FormItem className="space-y-4 bg-background/20 p-4 rounded-md border border-border/30">
                    <div className="flex justify-between items-center">
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Completion Progress</FormLabel>
                      <span className="text-xl font-bold font-mono text-primary text-glow-primary">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="py-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hoursPlayed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Hours Played</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          className="bg-background/50 border-border/50 font-mono" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Est. Value (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                          <Input 
                            type="number" 
                            min={0}
                            step="0.01"
                            className="bg-background/50 border-border/50 pl-7 font-mono text-secondary" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            disabled={form.watch("gameType") !== "purchased"}
                          />
                        </div>
                      </FormControl>
                      <p className="text-[10px] text-muted-foreground mt-1">Only purchased games contribute to account value.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 bg-background/20 p-4 rounded-md border border-border/30">
                <FormField
                  control={form.control}
                  name="achievementsUnlocked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Achievements Unlocked</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          className="bg-background/50 border-border/50 font-mono" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achievementsTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-wider text-muted-foreground">Total Achievements</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          className="bg-background/50 border-border/50 font-mono" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold uppercase tracking-widest box-glow-primary border-primary"
                disabled={createGame.isPending}
              >
                {createGame.isPending ? "Processing..." : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save to Vault
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

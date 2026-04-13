import { useEffect, useState } from "react";

type Game = {
  appid: number;
  name: string;
  playtime: number;
  image?: string;
};

export default function Games({ steamId }: { steamId?: string }) {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!steamId) return;

    setLoading(true);

    fetch(`/api/games?steamId=${steamId}`)
      .then(res => res.json())
      .then((data: Game[]) => {
        setGames(Array.isArray(data) ? data : []);
      })
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [steamId]);

  const safeGames = Array.isArray(games) ? games : [];

  const totalGames = safeGames.length;

  const totalPlaytime = safeGames.reduce((acc, game) => {
    return acc + (game.playtime || 0);
  }, 0);

  const filteredGames = safeGames.filter(game => {
    if (!game?.name) return false;

    if (
      search &&
      !game.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div style={{ padding: 20 }}>

      <h1 style={{ color: "#7c3aed" }}>
        🎮 Gamer Vault
      </h1>

      {/* DASHBOARD */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ background: "#1a1a2e", padding: 15, borderRadius: 12 }}>
          🎮 Jogos<br />
          <strong style={{ color: "#7c3aed" }}>{totalGames}</strong>
        </div>

        <div style={{ background: "#1a1a2e", padding: 15, borderRadius: 12 }}>
          ⏱ Horas<br />
          <strong style={{ color: "#7c3aed" }}>
            {Math.floor(totalPlaytime / 60)}
          </strong>
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Buscar jogo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
          background: "#1a1a2e",
          color: "#fff",
          width: "100%"
        }}
      />

      {/* LISTA */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filteredGames.map(game => (
            <div
              key={game.appid}
              style={{
                background: "#1a1a2e",
                padding: 15,
                borderRadius: 12,
                display: "flex",
                gap: 15,
                alignItems: "center"
              }}
            >
              {game.image && (
                <img
                  src={game.image}
                  style={{ width: 80, borderRadius: 8 }}
                />
              )}

              <div>
                <h3 style={{ color: "#7c3aed", margin: 0 }}>
                  {game.name}
                </h3>

                <p style={{ margin: 0 }}>
                  ⏱ {game.playtime} min
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

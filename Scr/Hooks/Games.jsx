import { useEffect, useState } from "react";

export default function Games({ steamId }) {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  // 🚀 busca jogos da API
  useEffect(() => {
    if (!steamId) return;

    fetch(`/api/games?steamId=${steamId}`)
      .then(res => res.json())
      .then(data => {
        setGames(Array.isArray(data) ? data : []);
      })
      .catch(() => setGames([]));
  }, [steamId]);

  // 🧠 proteção contra erro
  const safeGames = Array.isArray(games) ? games : [];

  // 🔍 filtro seguro
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
      <h1 style={{ color: "#7c3aed" }}>Seus Jogos 🎮</h1>

      {/* 🔎 search */}
      <input
        placeholder="Buscar jogo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
          border: "1px solid #333",
          background: "#1a1a2e",
          color: "#fff",
          width: "100%"
        }}
      />

      {/* 🎮 lista */}
      <div style={{ display: "grid", gap: 10 }}>
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <div
              key={game.appid}
              style={{
                background: "#1a1a2e",
                padding: 15,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 15
              }}
            >
              {game.image && (
                <img
                  src={game.image}
                  alt={game.name}
                  style={{ width: 80, borderRadius: 8 }}
                />
              )}

              <div>
                <h3 style={{ color: "#7c3aed", margin: 0 }}>
                  {game.name}
                </h3>

                <p style={{ margin: 0 }}>
                  ⏱ {game.playtime} min jogados
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ opacity: 0.6 }}>
            Nenhum jogo encontrado 🎮
          </p>
        )}
      </div>
    </div>
  );
}

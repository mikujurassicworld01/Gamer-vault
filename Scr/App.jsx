import { useState } from "react";
import Games from "./pages/Games";

export default function App() {
  const [steamId, setSteamId] = useState("");
  const [active, setActive] = useState(false);

  function handleStart() {
    if (steamId.trim()) {
      setActive(true);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        color: "#e5e7eb",
        padding: 20,
        fontFamily: "sans-serif"
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ color: "#7c3aed" }}>Gamer Vault 🎮</h1>
        <p>Analise sua conta Steam, progresso e valor</p>
      </header>

      {!active ? (
        <div
          style={{
            maxWidth: 400,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}
        >
          <input
            placeholder="Digite seu Steam ID"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid #333",
              background: "#1a1a2e",
              color: "#fff"
            }}
          />

          <button
            onClick={handleStart}
            style={{
              padding: 12,
              borderRadius: 8,
              border: "none",
              background: "#7c3aed",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Analisar conta 🚀
          </button>
        </div>
      ) : (
        <Games steamId={steamId} />
      )}
    </div>
  );
}

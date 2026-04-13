import { useState } from "react";
import Games from "./pages/Games";

export default function App() {
  const [steamId, setSteamId] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        color: "#e5e7eb",
        fontFamily: "sans-serif",
        padding: 20
      }}
    >
      <h1 style={{ color: "#7c3aed" }}>
        🎮 Gamer Vault
      </h1>

      <p style={{ opacity: 0.7 }}>
        Digite seu Steam ID
      </p>

      <input
        placeholder="Steam ID"
        value={steamId}
        onChange={(e) => setSteamId(e.target.value)}
        style={{
          padding: 10,
          width: "100%",
          marginBottom: 20,
          background: "#1a1a2e",
          color: "#fff",
          borderRadius: 8,
          border: "1px solid #333"
        }}
      />

      {steamId && <Games steamId={steamId} />}
    </div>
  );
}

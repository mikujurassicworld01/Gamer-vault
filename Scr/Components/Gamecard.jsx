export default function GameCard({ game }) {
  return (
    <div style={{
      background: "#1a1a2e",
      padding: 15,
      borderRadius: 12,
      display: "flex",
      gap: 15,
      alignItems: "center"
    }}>
      <img
        src={game.image}
        style={{ width: 80, borderRadius: 8 }}
      />

      <div>
        <h3 style={{ color: "#7c3aed", margin: 0 }}>
          {game.name}
        </h3>

        <p style={{ margin: 0 }}>
          ⏱ {game.playtime} min
        </p>
      </div>
    </div>
  );
}

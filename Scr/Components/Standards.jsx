export default function StatsCard({ title, value }) {
  return (
    <div style={{
      background: "#1a1a2e",
      padding: 15,
      borderRadius: 12,
      minWidth: 120
    }}>
      <p style={{ margin: 0, opacity: 0.7 }}>{title}</p>
      <h2 style={{ color: "#7c3aed", margin: 0 }}>{value}</h2>
    </div>
  );
}

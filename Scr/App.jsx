import Games from "./pages/Games";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f1a",
      color: "#e5e7eb",
      fontFamily: "sans-serif"
    }}>
      <Games steamId="76561198100000000" />
    </div>
  );
}

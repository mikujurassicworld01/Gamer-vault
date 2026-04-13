export async function getGames(steamId) {
  const res = await fetch(`/api/games?steamId=${steamId}`);
  return await res.json();
}

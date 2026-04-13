export default async function handler(req, res) {
  const { steamId } = req.query;

  const apiKey = process.env.STEAM_API_KEY;

  const url =
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
    `?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

  const response = await fetch(url);
  const data = await response.json();

  const games = data?.response?.games || [];

  const formatted = games.map(g => ({
    appid: g.appid,
    name: g.name,
    playtime: g.playtime_forever,
    image: `https://media.steampowered.com/steam/apps/${g.appid}/header.jpg`
  }));

  res.status(200).json(formatted);
}

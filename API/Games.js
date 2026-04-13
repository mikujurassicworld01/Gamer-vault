export default async function handler(req, res) {
  try {
    const { steamId } = req.query;

    if (!steamId) {
      return res.status(400).json({
        error: "steamId é obrigatório"
      });
    }

    const apiKey = process.env.STEAM_API_KEY;

    // 🔥 chamada real da Steam
    const url =
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
      `?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;

    const response = await fetch(url);
    const data = await response.json();

    const games = data?.response?.games || [];

    // 🎮 normaliza os dados
    const formattedGames = games.map((game) => ({
      appid: game.appid,
      name: game.name,
      playtime: game.playtime_forever,
      image: `https://media.steampowered.com/steam/apps/${game.appid}/header.jpg`
    }));

    res.status(200).json(formattedGames);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao buscar jogos da Steam"
    });
  }
}

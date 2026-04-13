useEffect(() => {
  fetch(`/api/games?steamId=${steamId}`)
    .then(res => res.json())
    .then(data => {
      setGames(Array.isArray(data) ? data : []);
    });
}, [steamId]);

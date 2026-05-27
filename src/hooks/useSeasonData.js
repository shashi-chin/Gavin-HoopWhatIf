import seasonData from '../data/season2026.json'

/**
 * Custom hook for season prediction data.
 * 
 * CURRENTLY: Returns static/mock data from season2026.json
 * 
 * FUTURE: This is designed to be easily swapped with real data.
 * 
 * To connect real current season stats later, you can:
 * 
 * 1. Use a free NBA API like balldontlie.io (requires free API key)
 *    Example:
 *    const response = await fetch('https://api.balldontlie.io/v1/standings?season=2025')
 * 
 * 2. Or use ESPN's unofficial public endpoints (less reliable)
 * 
 * 3. Or create your own backend that scrapes/caches NBA stats.
 * 
 * The UI components expect this shape:
 * - season
 * - predictedChampion
 * - easternConference / westernConference (array of {team, projectedWins, strength})
 * - topProjectedPlayers (array of {name, team, projectedPpg, projectedApg, projectedRpg})
 */

export function useSeasonData() {
  // In the future, you could add:
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  //
  // useEffect(() => {
  //   fetchLiveData().then(setData).catch(setError).finally(() => setLoading(false));
  // }, []);

  return {
    data: seasonData,
    loading: false,
    error: null,
    // isLive: false,  // Add this flag later when connecting real data
  };
}

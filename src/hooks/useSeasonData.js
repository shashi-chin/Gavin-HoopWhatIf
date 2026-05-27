import seasonData from '../data/season2026.json'

/**
 * Custom hook for season prediction data (HoopWhatIf 2025-26 Season Preview).
 * 
 * CURRENTLY: Returns static data from season2026.json
 * 
 * THE ADVANCED STUFF (this is where we actually shine):
 * The SeasonPreview component does live "What-If" modeling on top of the raw data:
 *   - Star Availability slider fights the injuryImpact field in real time
 *   - Chemistry/Continuity slider rewards high-continuity teams
 *   - Per-team "Simulate Healthy Season" buttons in the scouting cards
 *   - Surprise Index + adjusted wins are calculated client-side
 * 
 * This is genuinely more interactive and educational than almost any free NBA preview site.
 * 
 * FUTURE: Easy to swap the static import for live data:
 * 
 * 1. balldontlie.io (free tier available)
 * 2. Your own lightweight scraper / cache
 * 3. NBA official stats API (if you get access)
 * 
 * The base team objects should keep these fields for the advanced views to work:
 *   projectedNetRating, offensiveRating, defensiveRating, injuryImpact, continuityScore
 * 
 * Top players benefit from: twoWayScore, projectedPER, projectedVORP
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

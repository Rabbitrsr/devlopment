export const API_BASE_URL = 'http://192.168.1.70:3000';

const api = {
  REGISTER_USER: `${API_BASE_URL}/api/users/register`,
  LOGIN_USER: `${API_BASE_URL}/api/users/login`,
  UPDATE_USER: `${API_BASE_URL}/api/users/update`,
  GET_USER_DETAILS: `${API_BASE_URL}/api/users/details`,

  // Tournament APIs
  ADD_TOURNAMENT: `${API_BASE_URL}/api/tournaments/addtournament`,
  GET_TOURNAMENTS: `${API_BASE_URL}/api/tournaments/gettournaments`,
  UPDATE_TOURNAMENT: `${API_BASE_URL}/api/tournaments/update`,
  DELETE_TOURNAMENT: `${API_BASE_URL}/api/tournaments/delete`,

  // Team APIs
  ADD_TEAM: `${API_BASE_URL}/api/teams/addteam`,
  GET_TEAMS: `${API_BASE_URL}/api/teams/getteams`,
  UPDATE_TEAM: `${API_BASE_URL}/api/teams/update`,
  DELETE_TEAM: `${API_BASE_URL}/api/teams/delete`,

  // Player APIs
  ADD_PLAYER: `${API_BASE_URL}/api/players/addplayer`,
  UPDATE_PLAYER: `${API_BASE_URL}/api/players/updateplayer`,
  GET_PLAYERS: `${API_BASE_URL}/api/players/getplayers`,
  DELETE_PLAYER: `${API_BASE_URL}/api/players/deleteplayer`,

  // Match APIs
  ADD_MATCH: `${API_BASE_URL}/api/match/addmatch`,
  GET_LIVE_MATCHES: `${API_BASE_URL}/api/match/getlivematches`,
  GET_MATCHES: `${API_BASE_URL}/api/match/getmatches`,
  GET_MATCHES_FROM_ID: `${API_BASE_URL}/api/match/getmatchesfromid`,
  UPDATE_MATCH: `${API_BASE_URL}/api/match/update`,
  DELETE_MATCH: `${API_BASE_URL}/api/match/delete`,

  SETUP_MATCH: `${API_BASE_URL}/api/match/setupinningsstate`,               // POST
  GET_MATCH_SETUP: `${API_BASE_URL}/api/match/status`,           // GET with query param ?matchId=xxx

};

export default api;


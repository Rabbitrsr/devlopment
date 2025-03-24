export const API_BASE_URL = 'http://192.168.1.5:3000';

const api = {
  LOGIN: `${API_BASE_URL}/api/login`,

  // Tournament APIs
  ADD_TOURNAMENT: `${API_BASE_URL}/api/tournaments/addtournament`,
  GET_TOURNAMENTS: `${API_BASE_URL}/api/tournaments/gettournaments`,
  UPDATE_TOURNAMENT: `${API_BASE_URL}/api/tournaments/update`,
  DELETE_TOURNAMENT: `${API_BASE_URL}/api/tournaments/delete`,

  // Team APIs
  ADD_TEAM: `${API_BASE_URL}/api/teams/addteam`,
  GET_TEAMS: `${API_BASE_URL}/api/teams/getteams`,
  UPDATE_TEAM: `${API_BASE_URL}/api/teams/update`,                // Add backend if needed
  DELETE_TEAM: `${API_BASE_URL}/api/teams/delete`,

  // Player APIs
  ADD_PLAYER: `${API_BASE_URL}/api/addplayer`,
  GET_PLAYERS: `${API_BASE_URL}/api/getplayers`,                  // Optional if you expose a list
  DELETE_PLAYER: `${API_BASE_URL}/api/deleteplayer`,

  // Match APIs
  ADD_MATCH: `${API_BASE_URL}/api/addmatch`,
  GET_MATCHES: `${API_BASE_URL}/api/matches`,
  UPDATE_MATCH: `${API_BASE_URL}/api/matches/update`,             // If applicable
  DELETE_MATCH: `${API_BASE_URL}/api/matches/delete`,             // If applicable
};

export default api;


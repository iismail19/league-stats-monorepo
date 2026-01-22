export interface Participant {
  puuid: string;
  summonerId?: string; // encryptedSummonerId from match v5
  championName: string;
  championLevel?: number;
  kills: number;
  deaths: number;
  assists: number;
  teamId: number;
  win: boolean;
  totalMinionsKilled: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  goldEarned: number;
  visionScore: number;
  riotIdGameName?: string;
  riotIdTagline?: string;
  summoner1Id: number;
  summoner2Id: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
}

export interface Team {
  teamId: number;
  win: boolean;
}

export interface MatchInfo {
  gameMode: string;
  queueId: number;
  gameDuration: number;
  gameCreation: number;
  participants: Participant[];
  teams: Team[];
}

export interface Match {
  metadata: {
    matchId: string;
  };
  info: MatchInfo;
}

export interface MatchListResponse {
  puuid: string;
  matchDataList: Match[];
  failedMatches: string[];
  summonerId?: string; // Optional: encryptedSummonerId if available from match data
  // Pagination fields (from updated backend)
  hasMore?: boolean;       // true if more matches available
  nextStartIndex?: number; // starting index for next batch
  totalLoaded?: number;    // total matches loaded
  retryAfter?: number;     // seconds to wait if rate limited
}


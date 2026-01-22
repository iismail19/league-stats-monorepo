import { useState } from 'react';
import type { Match } from '../types/match';
import {
  getQueueName,
  formatGameDuration,
  formatTimeAgo,
  calculateKDA,
  getPlayerFromMatch,
  getTeamParticipants,
  formatNumber,
} from '../utils/matchUtils';
import { ChampionImage } from './ChampionImage';
import { ItemImage } from './ItemImage';
import { SummonerSpellImage } from './SummonerSpellImage';

interface MatchCardProps {
  match: Match;
  playerPuuid: string;
}

export const MatchCard = ({ match, playerPuuid }: MatchCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const player = getPlayerFromMatch(match, playerPuuid);
  
  if (!player) {
    if (import.meta.env.DEV) {
      console.warn('Player not found in match:', match.metadata.matchId);
    }
    return null;
  }

  const playerTeam = player.teamId;
  const playerTeamParticipants = getTeamParticipants(match, playerTeam);
  const enemyTeamParticipants = getTeamParticipants(match, playerTeam === 100 ? 200 : 100);
  const playerTeamWon = match.info.teams.find((t) => t.teamId === playerTeam)?.win || false;

  const kda = calculateKDA(player.kills, player.deaths, player.assists);
  const gameDuration = formatGameDuration(match.info.gameDuration);
  const timeAgo = formatTimeAgo(match.info.gameCreation);
  const queueName = getQueueName(match.info.queueId);

  const getKDAColor = (kda: number): string => {
    if (kda >= 3) return 'text-green-400';
    if (kda >= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Get player items
  const items = [player.item0, player.item1, player.item2, player.item3, player.item4, player.item5, player.item6];

  // Calculate CS per minute
  const csPerMin = ((player.totalMinionsKilled / match.info.gameDuration) * 60).toFixed(1);

  // Calculate max damage for each team (for bar scaling)
  const playerTeamMaxDamage = Math.max(
    ...playerTeamParticipants.map((p) => p.totalDamageDealtToChampions)
  );
  const enemyTeamMaxDamage = Math.max(
    ...enemyTeamParticipants.map((p) => p.totalDamageDealtToChampions)
  );

  return (
    <div
      className={`bg-[#1e2328] border rounded-lg overflow-hidden transition-all ${
        playerTeamWon ? 'border-green-500/30' : 'border-red-500/30'
      }`}
    >
      {/* Match Header - op.gg style compact */}
      <div
        className={`px-3 py-2 cursor-pointer hover:bg-[#252a32] transition-colors ${
          playerTeamWon ? 'bg-green-500/5' : 'bg-red-500/5'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {/* Left: Game Type & Time - horizontal */}
          <div className="flex-shrink-0 flex items-center gap-2 text-xs">
            <span className="text-[#a0a0a0]">{queueName}</span>
            <span className="text-[#6b7280]">•</span>
            <span className="text-[#6b7280]">{timeAgo}</span>
            <span className="text-[#6b7280]">•</span>
            <span className="text-[#6b7280]">{gameDuration}</span>
          </div>

          {/* Champion & Spells */}
          <div className="flex-shrink-0 flex items-center gap-1.5">
            <div className="relative">
              <ChampionImage championName={player.championName} size="lg" className="rounded-full" />
              {player.championLevel && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#0f1419] border border-[#2d3748] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {player.championLevel}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <SummonerSpellImage spellId={player.summoner1Id} size="sm" />
              <SummonerSpellImage spellId={player.summoner2Id} size="sm" />
            </div>
          </div>

          {/* KDA - horizontal */}
          <div className="flex-shrink-0 flex items-center gap-1.5">
            <span className={`text-base font-bold ${getKDAColor(kda)}`}>
              {player.kills} / {player.deaths} / {player.assists}
            </span>
            <span className="text-xs text-[#6b7280]">
              {kda.toFixed(2)}:1
            </span>
          </div>

          {/* Items - horizontal row */}
          <div className="flex-1 flex items-center gap-0.5">
            {items.slice(0, 6).map((itemId, idx) => (
              <ItemImage key={idx} itemId={itemId} size="sm" />
            ))}
            <ItemImage itemId={items[6] || 0} size="sm" className="ml-1" />
          </div>

          {/* Stats - horizontal */}
          <div className="flex-shrink-0 flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[#a0a0a0]">CS</span>
              <span className="font-semibold">{player.totalMinionsKilled}</span>
              <span className="text-[#6b7280]">({csPerMin})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#a0a0a0]">Gold</span>
              <span className="font-semibold">{formatNumber(player.goldEarned)}</span>
            </div>
          </div>

          {/* Expand/Collapse */}
          <div className="flex-shrink-0 text-[#6b7280] cursor-pointer text-xs">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[#2d3748] bg-[#0f1419]">
          {/* Teams Section */}
          <div className="p-4 grid grid-cols-2 gap-4">
            {/* Player's Team */}
            <div>
              <div className="text-sm font-semibold mb-3 text-green-400">Your Team</div>
              <div className="space-y-1.5">
                {playerTeamParticipants.map((participant) => (
                  <div
                    key={participant.puuid}
                    className={`flex items-center justify-between p-2 rounded ${
                      participant.puuid === playerPuuid ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-[#1e2328]'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <ChampionImage championName={participant.championName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {participant.riotIdGameName || 'Player'}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {participant.kills}/{participant.deaths}/{participant.assists}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-20 h-1.5 bg-[#1e2328] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all"
                          style={{
                            width: `${playerTeamMaxDamage > 0 ? (participant.totalDamageDealtToChampions / playerTeamMaxDamage) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-[#a0a0a0] w-12 text-right">
                        {formatNumber(participant.totalDamageDealtToChampions)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enemy Team */}
            <div>
              <div className="text-sm font-semibold mb-3 text-red-400">Enemy Team</div>
              <div className="space-y-1.5">
                {enemyTeamParticipants.map((participant) => (
                  <div
                    key={participant.puuid}
                    className="flex items-center justify-between p-2 rounded bg-[#1e2328]"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <ChampionImage championName={participant.championName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {participant.riotIdGameName || 'Player'}
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          {participant.kills}/{participant.deaths}/{participant.assists}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-20 h-1.5 bg-[#1e2328] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all"
                          style={{
                            width: `${enemyTeamMaxDamage > 0 ? (participant.totalDamageDealtToChampions / enemyTeamMaxDamage) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-[#a0a0a0] w-12 text-right">
                        {formatNumber(participant.totalDamageDealtToChampions)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="px-4 pb-4 pt-2 border-t border-[#2d3748] grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-[#a0a0a0] mb-1">Damage Dealt</div>
              <div className="font-semibold text-sm">{formatNumber(player.totalDamageDealtToChampions)}</div>
            </div>
            <div>
              <div className="text-[#a0a0a0] mb-1">Damage Taken</div>
              <div className="font-semibold text-sm">{formatNumber(player.totalDamageTaken)}</div>
            </div>
            <div>
              <div className="text-[#a0a0a0] mb-1">Vision Score</div>
              <div className="font-semibold text-sm">{player.visionScore}</div>
            </div>
            <div>
              <div className="text-[#a0a0a0] mb-1">Gold Earned</div>
              <div className="font-semibold text-sm">{formatNumber(player.goldEarned)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

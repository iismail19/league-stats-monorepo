import type { Match, Participant } from '../types/match';

export const getQueueName = (queueId: number): string => {
  const queueMap: Record<number, string> = {
    400: 'Normal Draft',
    420: 'Ranked Solo/Duo',
    430: 'Normal Blind',
    440: 'Ranked Flex',
    450: 'ARAM',
    700: 'Clash',
    900: 'URF',
    1020: 'One for All',
  };
  return queueMap[queueId] || `Queue ${queueId}`;
};

export const formatGameDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimeAgo = (timestamp: number): string => {
  // Riot API returns timestamp in milliseconds
  const now = Date.now();
  const gameTime = timestamp;
  const diff = now - gameTime;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const calculateKDA = (kills: number, deaths: number, assists: number): number => {
  if (deaths === 0) return kills + assists;
  return (kills + assists) / deaths;
};

export const getPlayerFromMatch = (match: Match, puuid: string): Participant | undefined => {
  return match.info.participants.find((p) => p.puuid === puuid);
};

export const getTeamParticipants = (match: Match, teamId: number): Participant[] => {
  return match.info.participants.filter((p) => p.teamId === teamId);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};


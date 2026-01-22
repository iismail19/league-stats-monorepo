import { getSummonerSpellImageUrl } from '../utils/itemImages';

interface SummonerSpellImageProps {
  spellId: number;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
};

export const SummonerSpellImage = ({ spellId, size = 'sm', className = '' }: SummonerSpellImageProps) => {
  const imageUrl = getSummonerSpellImageUrl(spellId);

  return (
    <img
      src={imageUrl}
      alt={`Spell ${spellId}`}
      className={`${sizeClasses[size]} rounded ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
};


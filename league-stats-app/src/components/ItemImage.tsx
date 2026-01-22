import { getItemImageUrl } from '../utils/itemImages';

interface ItemImageProps {
  itemId: number;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
};

export const ItemImage = ({ itemId, size = 'sm', className = '' }: ItemImageProps) => {
  const imageUrl = getItemImageUrl(itemId);

  if (!imageUrl) {
    return (
      <div
        className={`${sizeClasses[size]} rounded bg-[#0f1419] border border-[#2d3748] ${className}`}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`Item ${itemId}`}
      className={`${sizeClasses[size]} rounded object-cover ${className}`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = `${sizeClasses[size]} rounded bg-[#0f1419] border border-[#2d3748]`;
        target.parentNode?.appendChild(fallback);
      }}
    />
  );
};


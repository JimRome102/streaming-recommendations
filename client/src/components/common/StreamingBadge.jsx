const PLATFORM_COLORS = {
  netflix: 'bg-netflix',
  hulu: 'bg-hulu',
  prime: 'bg-prime',
  hbo: 'bg-hbo',
  disney: 'bg-disney',
  paramount: 'bg-paramount',
  showtime: 'bg-showtime',
  peacock: 'bg-peacock',
};

const PLATFORM_NAMES = {
  netflix: 'Netflix',
  hulu: 'Hulu',
  prime: 'Prime',
  hbo: 'Max',
  disney: 'Disney+',
  paramount: 'Paramount+',
  showtime: 'Showtime',
  peacock: 'Peacock',
};

const StreamingBadge = ({ platform }) => {
  return (
    <span
      className={`${PLATFORM_COLORS[platform]} text-white text-xs font-semibold px-2 py-1 rounded`}
    >
      {PLATFORM_NAMES[platform]}
    </span>
  );
};

export default StreamingBadge;

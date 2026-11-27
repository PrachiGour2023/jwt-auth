export function timeAgo(isoDateString: string) {
  const date = new Date(isoDateString);
  const secondsElapsed = Math.floor((Date.now() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const intervals: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  for (const { unit, seconds } of intervals) {
    const count = Math.floor(Math.abs(secondsElapsed) / seconds);
    if (count >= 1) {
      return rtf.format(secondsElapsed > 0 ? -count : count, unit);
    }
  }

  return 'just now';
}

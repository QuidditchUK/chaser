import parseISO from 'date-fns/parseISO';

// Parse timestamptz from database to JS Date
export const parseTimestamptz = (timestamp) =>
  parseISO(timestamp, 'yyyy-MM-dd HH:mm:ssX', new Date());

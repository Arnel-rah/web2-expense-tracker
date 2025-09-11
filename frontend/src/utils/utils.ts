export const createDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getDefaultDateRange = () => {
  const now = new Date();
  
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const localStartDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000));
  const localEndDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  
  return {
    start: localStartDate.toISOString().split('T')[0],
    end: localEndDate.toISOString().split('T')[0]
  };
};

export const isInDateRange = (date: string, start: Date, end: Date) => {
  const itemDate = new Date(date);
  return itemDate >= start && itemDate <= end;
};

export const formatPeriod = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start.toDateString() === end.toDateString()
    ? start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};
// export const getDefaultDateRange = () => {
//   const now = new Date();
//   const start = new Date(now.getFullYear(), now.getMonth(), 1);
//   const end = new Date();
  
//   const formatLocalDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };
  
//   return {
//     start: formatLocalDate(start),
//     end: formatLocalDate(end)
//   };
// };

export const createDateRange = (startDate: string, endDate: string) => {
  const formatDateToMidnight = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const start = formatDateToMidnight(startDate);
  const end = formatDateToMidnight(endDate);
  
  if (startDate === 'first-of-month') {
    const now = new Date();
    start.setFullYear(now.getFullYear());
    start.setMonth(now.getMonth());
    start.setDate(1);
  }
  
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
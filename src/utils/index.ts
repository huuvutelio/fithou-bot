export const formatDateTimeToGetTimetable = () => {
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const d = new Date();
  const day = weekday[d.getDay()];

  if (day === 'Sunday') {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() - 1}`;
  }

  // 2023-03-21
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

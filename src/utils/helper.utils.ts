import { startOfWeek, addDays } from 'date-fns';

export const getWeekRange = (week: number, year: number): Date[] => {
  const jan1 = new Date(year, 0, 1);
  const offsetDays = (week - 1) * 7;
  const startMonday = startOfWeek(addDays(jan1, offsetDays), {
    weekStartsOn: 1,
  });

  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startMonday, i);
    date.setHours(0, 0, 0, 0);
    return date;
  });
};

import { format } from 'date-fns';

export function toICSDate(dateStr) {
  const date = new Date(dateStr);
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

export function createICS(title, description, startDate, endDate) {
  return `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT
END:VCALENDAR`.trim();
}

export function downloadICS(title, description, date) {
  const start = toICSDate(date);
  const end = toICSDate(new Date(new Date(date).getTime() + 30 * 60 * 1000));
  const content = createICS(title, description, start, end);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/\s/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import { Timer, TimerState } from "../types";

export const formatTime = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const formatTimeShort = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
};

export const getTodayTime = (timers: Timer[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return timers
    .filter((timer) => timer.completedAt)
    .reduce((total, timer) => {
      const timerDate = new Date(timer.createdAt);
      if (timerDate >= today) {
        return total + timer.totalTime;
      }
      return total;
    }, 0);
};

export const getWeekTime = (timers: Timer[]): number => {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  return timers
    .filter((timer) => timer.completedAt)
    .reduce((total, timer) => {
      const timerDate = new Date(timer.createdAt);
      if (timerDate >= weekStart) {
        return total + timer.totalTime;
      }
      return total;
    }, 0);
};

export const getProjectBreakdown = (
  timers: Timer[]
): Record<string, number> => {
  return timers
    .filter((timer) => timer.completedAt)
    .reduce<Record<string, number>>((acc, timer) => {
      acc[timer.project] = (acc[timer.project] || 0) + timer.totalTime;
      return acc;
    }, {});
};

export const getCompletedBreakdown = (
  timers: Timer[]
): Record<string, number> => {
  return timers
    .filter((timer) => timer.completedAt)
    .reduce<Record<string, number>>((acc, timer) => {
      acc[timer.project] = (acc[timer.project] || 0) + timer.totalTime;
      return acc;
    }, {});
};

export const exportJSON = (state: TimerState): void => {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  downloadFile(
    blob,
    `timesnap-backup-${new Date().toISOString().split("T")[0]}.json`
  );
};

export const exportCSV = (timers: Timer[], hourlyRate: number): void => {
  const headers =
    "Timer Name,Project,Total Time (hours),Created Date,Earnings ($)";
  const rows = timers.map((t) => {
    const hours = (t.totalTime / 3600000).toFixed(2);
    const earnings = (parseFloat(hours) * hourlyRate).toFixed(2);
    return `"${t.name}","${t.project}",${hours},"${new Date(
      t.createdAt
    ).toLocaleDateString()}",${earnings}`;
  });

  const totalHours = (
    timers.reduce((sum, t) => sum + t.totalTime, 0) / 3600000
  ).toFixed(2);
  const totalEarnings = (parseFloat(totalHours) * hourlyRate).toFixed(2);
  rows.push(`"TOTAL","",${totalHours},"",${totalEarnings}`);

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  downloadFile(
    blob,
    `timesnap-report-${new Date().toISOString().split("T")[0]}.csv`
  );
};

const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

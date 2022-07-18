export type StatsType = {
  played: {
    text: string;
    count: number;
  };
  win: {
    text: string;
    count: number;
  };
  currentStreak: {
    text: string;
    count: number;
  };
  maxStreak: {
    text: string;
    count: number;
  };
};

export const initialStats = {
  played: {
    text: 'Played',
    count: 0,
  },
  win: {
    text: 'Win %',
    count: 0,
  },
  currentStreak: {
    text: 'Current Streak',
    count: 0,
  },
  maxStreak: {
    text: 'Max Streak',
    count: 0,
  },
};

export const initialGuessDistribution = [0, 0, 0, 0, 0, 0];

export const updateStats = (stats: StatsType, result: boolean) => {
  let newStats = { ...stats };
  let winNumber = (stats.played.count * stats.win.count) / 100;

  newStats.played.count = newStats.played.count + 1;
  if (result) {
    newStats.win.count = ((winNumber + 1) / newStats.played.count) * 100;
    newStats.currentStreak.count = newStats.currentStreak.count + 1;
  }

  if (!result) {
    newStats.win.count = (winNumber / newStats.played.count) * 100;
    newStats.currentStreak.count = 0;
  }

  if (newStats.currentStreak.count > newStats.maxStreak.count) {
    newStats.maxStreak.count = newStats.currentStreak.count;
  }

  return newStats;
};

export const dateToday = () =>
  new Date().toJSON().slice(0, 10).replace(/-/g, '/');

import { INITIAL_LOGS } from '../data/initialLogs';

const KEYS = {
  LOGS: 'ecotrack_logs',
  SETTINGS: 'ecotrack_settings',
  COMPLETED_SUGGESTIONS: 'ecotrack_completed_sugs',
  USER_POINTS: 'ecotrack_user_points'
};

/**
 * Get all logs from localStorage, default to INITIAL_LOGS if empty
 */
export function getLogs() {
  try {
    const raw = localStorage.getItem(KEYS.LOGS);
    if (!raw) {
      // Seed with initial logs
      localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing logs', e);
    return INITIAL_LOGS;
  }
}

/**
 * Save logs to localStorage
 */
export function saveLogs(logs) {
  try {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
    return true;
  } catch (e) {
    console.error('Error saving logs', e);
    return false;
  }
}

/**
 * Add or update a single day's log
 */
export function saveLogForDate(date, inputs) {
  const logs = getLogs();
  const existingIndex = logs.findIndex(l => l.date === date);

  if (existingIndex >= 0) {
    // Update existing
    logs[existingIndex].inputs = inputs;
  } else {
    // Add new
    logs.push({
      id: `log-${Date.now()}`,
      date,
      inputs
    });
  }

  // Sort logs by date ascending
  logs.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveLogs(logs);
  return logs;
}

/**
 * Get app settings (e.g. name, daily carbon goal in kg)
 */
export function getSettings() {
  const defaultSettings = {
    userName: 'Eco Explorer',
    dailyTarget: 12.0, // standard target: 12kg CO2 per day (normal averages are 20-30kg)
  };

  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    return defaultSettings;
  }
}

/**
 * Save app settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get list of completed suggestion IDs
 */
export function getCompletedSuggestions() {
  try {
    const raw = localStorage.getItem(KEYS.COMPLETED_SUGGESTIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Mark a suggestion as completed
 */
export function toggleSuggestionCompleted(id, pointsReward) {
  try {
    const completed = getCompletedSuggestions();
    const index = completed.indexOf(id);
    let isCompleted = false;

    if (index >= 0) {
      // Undo completion
      completed.splice(index, 1);
      adjustPoints(-pointsReward);
    } else {
      // Mark as completed
      completed.push(id);
      adjustPoints(pointsReward);
      isCompleted = true;
    }

    localStorage.setItem(KEYS.COMPLETED_SUGGESTIONS, JSON.stringify(completed));
    return { completed, isCompleted };
  } catch (e) {
    console.error('Error toggling suggestion', e);
    return { completed: [], isCompleted: false };
  }
}

/**
 * Get overall Eco Points
 */
export function getPoints() {
  try {
    const raw = localStorage.getItem(KEYS.USER_POINTS);
    if (!raw) {
      // Start with 150 points as initial onboarding welcome bonus
      localStorage.setItem(KEYS.USER_POINTS, '150');
      return 150;
    }
    return parseInt(raw, 10) || 0;
  } catch (e) {
    return 150;
  }
}

/**
 * Adjust points count
 */
export function adjustPoints(amount) {
  try {
    const current = getPoints();
    const nextPoints = Math.max(0, current + amount);
    localStorage.setItem(KEYS.USER_POINTS, nextPoints.toString());
    return nextPoints;
  } catch (e) {
    return 0;
  }
}

/**
 * Clear all data to restore to default seed logs
 */
export function resetAppData() {
  localStorage.removeItem(KEYS.LOGS);
  localStorage.removeItem(KEYS.SETTINGS);
  localStorage.removeItem(KEYS.COMPLETED_SUGGESTIONS);
  localStorage.removeItem(KEYS.USER_POINTS);
  return {
    logs: getLogs(),
    settings: getSettings(),
    completedSuggestions: getCompletedSuggestions(),
    points: getPoints()
  };
}

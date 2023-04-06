export function getCurrentEpochTimestampInSeconds() {
  return Math.round(new Date().getTime() / 1000);
}
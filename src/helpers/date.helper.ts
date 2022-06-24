/**
 * Takes in the time in miliseconds and formats it as a string
 *
 * @param timeMs Time in MS
 * @returns {String} Formatted date
 */
export const getDurationString = (timeMs: number) => {
  const dateObj = new Date(timeMs);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
};

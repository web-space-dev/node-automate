const data = require("./toggl-data.json");

function getDurationString(timeMs) {
  const dateObj = new Date(timeMs);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Takes in a toggl time entry and converts it to plutio format
 *
 * @param {Object} item
 * @returns {Object} entry
 */
function buildTimeEntry(item) {
  return {
    title: `${item.project} - ${item.description}`,
    startedAt: item.start,
    stoppedAt: item.end,
    duration: item.dur,
    isManualTime: true,
    billingRate: process.env.PLUTIO_BILLING_RATE,
  };
}

/**
 * Takes in an array of toggl entries and sorts them by project
 *
 * @param {Array} data
 * @returns {Array} projects
 */
function sortDataIntoProjects(data) {
  const projects = [];

  data.forEach((item) => {
    const projectI = projects.findIndex((proj) => proj.id === item.pid);
    if (projectI == -1) {
      const project = {
        id: item.pid,
        entries: [],
        duration: 0,
      };
      project.entries.push(buildTimeEntry(item));
      project.duration += item.dur;
      projects.push(project);
    } else {
      projects[projectI].entries.push(buildTimeEntry(item));
      projects[projectI].duration += item.dur;
    }
  });
  return projects;
}

const projects = sortDataIntoProjects(data.data);

projects.forEach(
  (proj) => (proj.durationString = getDurationString(proj.duration))
);

console.log(projects);

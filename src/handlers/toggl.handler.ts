import axios from "axios";

import config from "../../config/config";
import {
  ITogglProjectObj,
  ITogglEntry,
  IPlutioEntry,
  ITogglData,
} from "../interfaces";

/**
 * Takes in a toggl time entry and converts it to plutio format
 *
 * @param {Object} item
 * @returns {Object} entry
 */
export const buildTimeEntry = (item: ITogglEntry): IPlutioEntry => {
  return {
    title: `${item.project} - ${item.description}`,
    startedAt: item.start.toISOString(),
    stoppedAt: item.end.toISOString(),
    duration: item.dur,
    isManualTime: true,
    billingRate: parseInt(process.env.PLUTIO_BILLING_RATE, 10),
  };
};

/**
 * Takes in an array of toggl entries and sorts them by project
 *
 * @param {Array} data
 * @returns {Array} projects
 */
export const sortDataIntoProjects = (
  data: ITogglEntry[]
): ITogglProjectObj[] => {
  const projects: ITogglProjectObj[] = [];

  data.forEach((item) => {
    const projectI = projects.findIndex((proj) => proj.id === item.pid);
    if (projectI === -1) {
      const project: ITogglProjectObj = {
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
};

export const fetchData = (): Promise<ITogglData> => {
  return new Promise((resolve, reject) => {
    const tags = {
      billable: config.TOGGL_BILLABLE_TAG,
      billed: config.TOGGL_BILLED_TAG,
    };
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth())
      .toISOString()
      .split("T")[0]; // Beginning of current month
    const until = new Date().toISOString().split("T")[0]; // Now

    const username = process.env.TOGGL_API_KEY;
    const password = "api_token";
    //   const auth = btoa(`${username}:${password}`);
    // const auth = Buffer.from(`${username}:${password}`, "base64").toString();
    const auth = btoa(`${username}:${password}`);
    axios
      .get<ITogglData>(
        `https://api.track.toggl.com/reports/api/v2/details?workspace_id=${config.TOGGL_WORKSPACE_ID}&since=${since}&until=${until}&user_agent=api_test&tag_ids=${tags.billable}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      )
      .then((response) => {
        console.log(JSON.stringify(response));
        //@ts-ignore
        resolve(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("Error fetching toggl data", error);
        reject(error);
      });
  });
};

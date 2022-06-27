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
    startedAt: new Date(item.start).toISOString(),
    stoppedAt: new Date(item.end).toISOString(),
    isManualTime: true,
    billingRate: parseInt(config.PLUTIO_BILLING_RATE, 10),
    categoryId: config.PLUTIO_CATEGORY_ID,
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
  return new Promise(async (resolve, reject) => {
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

    const auth = btoa(`${username}:${password}`);

    try {
      const response = await axios.get<ITogglData>(
        `https://api.track.toggl.com/reports/api/v2/details?workspace_id=${config.TOGGL_WORKSPACE_ID}&since=${since}&until=${until}&user_agent=api_test&tag_ids=${tags.billable}`,
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      resolve(response.data);
    } catch (err) {
      console.log("Error fetching toggl data", err);
      reject(err);
    }
  });
};

const updateTogglEntry = (id: string): Promise<boolean> => {
  return new Promise(async(resolve, reject) => {


    fetch("https://api.track.toggl.com/api/v9/workspaces/{workspace_id}/time_entries/{time_entry_id}", {
  method: "PUT",
  
    }
  })
}


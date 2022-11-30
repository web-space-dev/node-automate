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
  const rgx = new RegExp(/name:\w{2,}.\w{2,}/);
  let title = item.project;

  item.tags.map((tag) => {
    const match = tag.match(rgx);
    if (match) title = tag.split(":")[1];
  });

  return {
    id: item.id,
    plutioEntry: {
      title: `${title} - ${item.description}`,
      startedAt: new Date(item.start).toISOString(),
      stoppedAt: new Date(item.end).toISOString(),
      isManualTime: true,
      billingRate: parseInt(config.PLUTIO_BILLING_RATE, 10),
      categoryId: config.PLUTIO_CATEGORY_ID,
    },
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
        toggleId: item.id,
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
      to_be_billed: config.TOGGL_TO_BE_BILLED_TAG,
    };
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - 2)
      .toISOString()
      .split("T")[0]; // Beginning of current month
    const until = new Date().toISOString().split("T")[0]; // Now

    const username = process.env.TOGGL_API_KEY;
    const password = "api_token";

    const auth = btoa(`${username}:${password}`);

    try {
      const response = await axios.get<ITogglData>(
        `https://api.track.toggl.com/reports/api/v2/details?workspace_id=${config.TOGGL_WORKSPACE_ID}&since=${since}&until=${until}&user_agent=api_test&tag_ids=${tags.to_be_billed}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      resolve(response.data);
    } catch (err) {
      console.log("Error fetching toggl data", err.message);
      reject(err);
    }
  });
};

export const updateTogglEntry = (id: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    const username = process.env.TOGGL_API_KEY;
    const password = "api_token";

    // const auth = btoa(`${username}:${password}`);
    const auth = {
      username: process.env.TOGGL_API_KEY,
      password: "api_token",
    };
    const data = JSON.stringify({
      time_entry: {
        tags: ["Billed-API"],
      },
    });

    // const axiosData = {
    //   method: "put",
    //   url: "https://api.track.toggl.com/api/v8/time_entries/2598848741",
    //   headers: {
    //     Authorization: "Basic e3thcGlfdG9rZW59fTphcGlfdG9rZW4=",
    //     "Content-Type": "application/json",
    //   },
    //   data,
    // };

    try {
      // const response = await axios(axiosData);
      const response = await axios.put(
        `https://api.track.toggl.com/api/v8/time_entries/${id}`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },

          data,
        },
        {
          auth,
        }
      );
      console.log(response);
      resolve(true);
    } catch (err) {
      console.log("Error fetching toggl data", err.message);
      reject(false);
    }
  });
};

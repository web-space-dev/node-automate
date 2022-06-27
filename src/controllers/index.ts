import { fetchData, sortDataIntoProjects } from "../handlers/toggl.handler";
import { createEntry, refreshToken } from "../handlers/plutio.handler";

export const main = async () => {
  try {
    // Fetch Toggl data
    const data = await fetchData();
    // Sort it via each project
    const sortedData = sortDataIntoProjects(data.data);
    // Generate or fetch existing plutio access token
    const token = await refreshToken();

    sortedData.forEach((item) => {
      item.entries.forEach(async (entry) => {
        const updated = await createEntry(token, entry);

        if (entry.updated) {
        }
      });

      // console.log(currentItem);
    });
  } catch (err) {
    console.log("System Error: ", err);
  }
};

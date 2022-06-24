import { fetchData, sortDataIntoProjects } from "../handlers/toggl.handler";

export const main = async () => {
  try {
    const data = await fetchData();
    if (data.error) {
      throw new Error(data.error.message);
    }

    const sortedData = sortDataIntoProjects(data.data);

    sortedData.forEach((item) => {
      const currentItem = item;

      console.log(currentItem);
    });
  } catch (err) {
    console.log("System Error: ", err);
  }
};

import {
  fetchData,
  sortDataIntoProjects,
  updateTogglEntry,
} from "../handlers/toggl.handler";
import { createEntry, refreshToken } from "../handlers/plutio.handler";
import { Request, Response } from "express";
import { IPlutioEntry, ITogglProjectObj } from "../interfaces";

export const main = async (req: Request, res: Response) => {
  // const response: IPlutioEntry[] = [];
  try {
    // Fetch Toggl data
    const data = await fetchData();

    // Sort it via each project
    const sortedData = sortDataIntoProjects(data.data);
    // Generate or fetch existing plutio access token
    const token = await refreshToken();

    const response = await createAndUpdateEntries(token, sortedData);

    res.status(200).json(response);
  } catch (err) {
    console.log("System Error: ", err);
    res.status(500).send("Error");
  }
};

const createAndUpdateEntries = async (
  token: string,
  sortedData: ITogglProjectObj[]
) => {
  // return new Promise(async (resolve) => {
  const response: IPlutioEntry[] = [];
  return Promise.all(
    sortedData.map(async (item) => {
      item.entries.forEach(async (entry) => {
        const updated = await createEntry(token, entry);

        if (!updated) return;

        entry.updated = await updateTogglEntry(entry.id);
        response.push(entry);
      });
    })
  ).then(() => {
    return response;
  });
};

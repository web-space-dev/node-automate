import { fetchData, sortDataIntoProjects } from "../handlers/toggl.handler";
import {
  createEntry,
  deleteEntry,
  getAllEntries,
  refreshToken,
} from "../handlers/plutio.handler";
import { Request, Response } from "express";
import { IPlutioEntry, ITogglProjectObj } from "../interfaces";

export const main = async (req: Request, res: Response) => {
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
  return new Promise(async (resolve, reject) => {
    const response: IPlutioEntry[] = [];
    try {
      for await (const item of sortedData) {
        for await (const entry of item.entries) {
          const updated = await createEntry(token, entry);

          if (!updated) return;

          entry.updated = true;
          // await updateTogglEntry(entry.id);
          response.push(entry);
        }
      }

      resolve(response);
    } catch (err) {
      console.log("createandUpdate error", err);
      reject("err");
    }
  });
};

export const clearEntries = async (req: Request, res: Response) => {
  try {
    // Generate or fetch existing plutio access token
    const token = await refreshToken();

    // Fetch entires
    const entires = await getAllEntries(token);

    const result = [];
    for await (const entry of entires) {
      const deletedEntry = await deleteEntry(token, entry._id);
      result.push({ _id: entry._id, success: deletedEntry });
    }

    res.status(200).json({
      message: `${result.length} entries deleted`,
      data: result,
    });
  } catch (err) {
    console.log("System Error: ", err);
    res.status(500).send("Error");
  }
};

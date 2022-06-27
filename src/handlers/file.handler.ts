import fs from "fs";
import { ITokenObj } from "../interfaces";

const path: string = "./plutio_token.json";

/**
 * Saves an object to the specified file path
 *
 * @param {ITokenObj} obj
 * @returns {boolean}
 */
export const saveTokenToFile = (obj: ITokenObj): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(path, JSON.stringify(obj));
      resolve(true);
    } catch (err) {
      console.log("Error saving token to file", err);
      reject(false);
    }
  });
};

/**
 * Checks for a file containing an already existing plutio access token
 *
 * @returns String | null - String that is the existing access token, null if it does not exist
 */
export const checkForFile = async (): Promise<string | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.accessSync(path);
      const file = fs.readFileSync(path, "utf8");
      const parsedFile = JSON.parse(file);

      if (new Date(parsedFile.access_token_expires) > new Date()) {
        return resolve(parsedFile.access_token);
      }
      resolve(null);
    } catch (err) {
      console.log("Error checking for file", err);
      resolve(null);
    }
  });
};

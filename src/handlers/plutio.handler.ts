import axios from "axios";
import qs from "qs";

import config from "../../config/config";
import { IPlutioEntry, IPlutioResponse, ITokenObj } from "../interfaces";
import { checkForFile, saveTokenToFile } from "./file.handler";

/**
 * Checks if an existing access token exists and returns it
 * If not, fetches a new access token from plutio API
 *
 * @returns String - returns the plutio access token
 */
export const refreshToken = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingAccessToken = await checkForFile();
      if (existingAccessToken) {
        return resolve(existingAccessToken);
      }

      const data = qs.stringify({
        client_id: config.PLUTIO_CLIENT_ID,
        client_secret: config.PLUTIO_CLIENT_SECRET,
        grant_type: "client_credentials",
      });

      const response = await axios({
        method: "post",
        url: "https://api.plutio.com/v1.8/oauth/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
      });

      const obj: ITokenObj = {
        access_token: response.data.accessToken,
        access_token_expires: new Date(
          response.data.accessTokenExpiresAt
        ).toISOString(),
      };
      await saveTokenToFile(obj);
      resolve(response.data.accessToken);
    } catch (err) {
      console.log("Error fetching plutio access token: ", err);
      reject(err);
    }
  });
};

export const createEntry = (
  token: string,
  entry: IPlutioEntry
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = JSON.stringify(entry.plutioEntry);
      const result = await axios({
        method: "post",
        url: "https://api.plutio.com/v1.8/time-tracks",
        headers: {
          Business: config.PLUTIO_BUSINESS_DOMAIN,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });

      resolve(result ? true : false);
    } catch (err) {
      console.log("Error: Could not create Plutio Time entry", err);
      resolve(false);
    }
  });
};

export const getAllEntries = (token: string): Promise<IPlutioResponse[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get<IPlutioResponse[]>(
        "https://api.plutio.com/v1.8/time-tracks?billingStatus=unpaid",
        {
          headers: {
            Business: config.PLUTIO_BUSINESS_DOMAIN,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resolve(result.data);
    } catch (err) {
      console.log("Error: Could not get Plutio entries", err);
      resolve(err);
    }
  });
};

export const deleteEntry = (token: string, id: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    const data = JSON.stringify({ _id: id });
    try {
      const result = await axios({
        method: "delete",
        url: "https://api.plutio.com/v1.8/time-tracks",
        headers: {
          Business: config.PLUTIO_BUSINESS_DOMAIN,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });

      resolve(result ? true : false);
    } catch (err) {
      console.log("Error: Could not delete Plutio entry", err);
      resolve(err);
    }
  });
};

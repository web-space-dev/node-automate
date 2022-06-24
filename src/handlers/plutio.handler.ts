import { IPlutioData, ITokenObj } from "../interfaces";

import axios from "axios";
import qs from "qs";
import fs from "fs";

const path: string = "./plutio_token.json";

const checkForFile = () => {
  if (fs.existsSync(path)) {
    console.log("!!!!hello");

    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return refreshToken();
      }
      const result = JSON.parse(data);

      if (new Date(result.access_token_expires) > new Date()) {
        return result.access_token;
      }

      return refreshToken();
    });
  }
  return refreshToken();
};

const refreshToken = () => {
  const data = qs.stringify({
    client_id: process.env.PLUTIO_CLIENT_ID,
    client_secret: process.env.PLUTIO_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  axios
    .post<IPlutioData>(
      "https://api.plutio.com/v1.8/oauth/token",
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
      }
    )
    .then((response) => {
      console.log(JSON.stringify(response.data));
      const obj: ITokenObj = {
        access_token: response.data.accessToken,
        access_token_expires: response.data.accessTokenExpiresAt.toISOString(),
      };
      saveTokenToFile(obj);
      return response.data.accessToken;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

function saveTokenToFile(obj: ITokenObj) {
  fs.writeFile(path, JSON.stringify(obj), (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}

// let token = checkForFile();

// if (!token) {
//   console.log("Could not generate client access token");
//   return;
// }

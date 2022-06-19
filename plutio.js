const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = "./plutio_token.json";

function checkForFile() {
  // try {
  console.log("hello");
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
}

function refreshToken() {
  let data = qs.stringify({
    client_id: process.env.PLUTIO_CLIENT_ID,
    client_secret: process.env.PLUTIO_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  let config = {
    method: "post",
    url: "https://api.plutio.com/v1.8/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      const obj = {
        access_token: response.data.accessToken,
        access_token_expires: response.data.accessTokenExpiresAt,
      };
      saveTokenToFile(JSON.stringify(obj));
      return response.data.accessToken;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}

function saveTokenToFile(obj) {
  fs.writeFile(path, obj, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}

let token = checkForFile();

if (!token) {
  console.log("Could not generate client access token");
  return;
}

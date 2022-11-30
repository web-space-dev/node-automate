const axios = require("axios");
let data = JSON.stringify({
  time_entry: {
    tags: ["Billed-API"],
  },
});

let config = {
  method: "put",
  url: "https://api.track.toggl.com/api/v8/time_entries/2598848741",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

axios(config, {
  username: "c57120cd0afc8d6c0939ecb7268068f1",
  password: "api_token",
})
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

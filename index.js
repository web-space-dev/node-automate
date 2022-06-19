require("dotenv").config();

const workspace_id = 4225243;
// const project_id = 160232944; // ILC
const tags = {
  billable: 7848320,
  billed: 7880776,
};
const now = new Date();
const since = new Date(now.getFullYear(), now.getMonth())
  .toISOString()
  .split("T")[0]; // Beginning of current month
const until = new Date().toISOString().split("T")[0]; // Now

const username = process.env.TOGGL_API_KEY;
const password = "api_token";
const auth = btoa(`${username}:${password}`);

let config = {
  method: "get",
  url: `https://api.track.toggl.com/reports/api/v2/details?workspace_id=${workspace_id}&since=${since}&until=${until}&user_agent=api_test&tag_ids=${tags.billable}`,
  headers: {
    Authorization: `Bearer ${auth}`,
  },
};

axios(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

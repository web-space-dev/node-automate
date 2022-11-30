import config from "../config/config";
import app from "./express";

/**
 * Listen on the specified port, and for any errors
 */
app
  .listen(config.PORT, () => {
    console.info("Server started on port %s.", config.PORT);
  })
  .on("error", (err: any) => {
    console.error("Server Error: ", err);
  });

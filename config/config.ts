import dotenv from "dotenv";
dotenv.config();

const config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  TOGGL_API_KEY: process.env.TOGGL_API_KEY,
  TOGGL_WORKSPACE_ID: process.env.TOGGL_WORKSPACE_ID,
  TOGGL_PROJECT_ID: process.env.TOGGL_PROJECT_ID,
  TOGGL_BILLABLE_TAG: process.env.TOGGL_BILLABLE_TAG,
  TOGGL_BILLED_TAG: process.env.TOGGL_BILLED_TAG,
  PLUTIO_CLIENT_ID: process.env.PLUTIO_CLIENT_ID,
  PLUTIO_CLIENT_SECRET: process.env.PLUTIO_CLIENT_SECRET,
  PLUTIO_BUSINESS_DOMAIN: process.env.PLUTIO_BUSINESS_DOMAIN,
  PLUTIO_BILLING_RATE: process.env.PLUTIO_BILLING_RATE,
  PLUTIO_CATEGORY_ID: process.env.PLUTIO_CATEGORY_ID,
  TOGGL_TO_BE_BILLED_TAG: process.env.TOGGL_TO_BE_BILLED_TAG,
};

export default config;

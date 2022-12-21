/**
 * Object used after sorting time entries via project
 */
export interface ITogglProjectObj {
  id: number;
  toggleId: number;
  entries: IPlutioEntry[];
  duration: number;
}

/**
 * Network response from Toggl
 */
export interface ITogglData {
  total_grand?: number;
  total_billable?: null;
  total_currencies?: TotalCurrency[];
  total_count?: number;
  per_page?: number;
  data?: ITogglEntry[];
  error?: TogglError;
}

/**
 * Single Time Entry
 */
export interface ITogglEntry {
  id?: number;
  pid?: number;
  tid?: null;
  uid?: number;
  description?: string;
  start?: Date;
  end?: Date;
  updated?: Date;
  dur?: number;
  user?: string;
  use_stop?: boolean;
  client?: null | string;
  project?: string;
  project_color?: string;
  project_hex_color?: string;
  task?: null;
  billable?: null;
  is_billable?: boolean;
  cur?: null;
  tags?: Tag[];
}

export enum Tag {
  Billable = "Billable",
  Call = "Call",
  WebDevelopment = "Web Development",
}

export interface TotalCurrency {
  currency?: null;
  amount?: null;
}

export interface TogglError {
  message?: string;
  tip?: string;
  code?: number;
}

/**
 * ITimeEntry
 *
 * Time Entry for Plutio
 */
export interface IPlutioEntry {
  id: number;
  updated?: boolean;
  plutioEntry: {
    title: string;
    startedAt: string;
    stoppedAt: string;
    duration?: number;
    isManualTime: boolean;
    billingRate: number;
    categoryId: string;
    updated?: boolean;
  };
}

export interface IPlutioResponse {
  _id: string;
  title: string;
  billingRate: number;
  categoryId: string;
  isManualTime: boolean;
  startedAt: Date;
  stoppedAt: Date;
  time: number;
  status: string;
  personId: string;
  currency: string;
  costRate: number;
  costAmount: number;
  billingAmount: number;
  billingStatus: string;
  costStatus: string;
  createdAt: Date;
  createdBy: string;
  businessId: string;
  updatedAt: Date;
}

/**
 * For saving the token in the file system
 */
export interface ITokenObj {
  access_token: string;
  access_token_expires: string;
}

/**
 * Plutio Network Request
 */
export interface IPlutioData {
  accessToken?: string;
  accessTokenExpiresAt?: Date;
  scope?: string;
  access_token?: string;
  expires_in?: number;
  client?: Client;
  user?: User;

  statusCode?: number;
  status?: number;
  code?: number;
  message?: string;
  name?: string;
}

export interface Client {
  id?: string;
  userId?: string;
  businesses?: string[];
  grants?: string[];
}

export interface User {
  id?: string;
}

/**
 * Object used after sorting time entries via project
 */
export interface ITogglProjectObj {
  id: number;
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
  title: string;
  startedAt: string;
  stoppedAt: string;
  duration?: number;
  isManualTime: boolean;
  billingRate: number;
  categoryId: string;
  updated?: boolean;
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

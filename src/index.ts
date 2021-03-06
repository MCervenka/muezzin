import { api } from "./api";
import { CallBehavior, AppState } from "./types";
import { clearErrors, ClearErrorBehavior } from "./actions/error";
import { getErrors } from "./selectors/getErrors";
import { isLoading } from "./selectors/isLoading";
import { watchAPI } from "./sagas/watchAPI";
import { withAPI, apiReducer } from "./withAPI";
import {
  addDefaultHeaderKey,
  clearDefaultHeaderKey,
  getDefaultHeaders,
  setDefaultHeaders,
} from "./headers";
import {
  getDefaultErrorInterceptors,
  setDefaultErrorInterceptors,
} from "./errors";
import { setupAxios } from "./axios";

export {
  addDefaultHeaderKey,
  api,
  apiReducer,
  AppState,
  CallBehavior,
  clearDefaultHeaderKey,
  ClearErrorBehavior,
  clearErrors,
  getDefaultErrorInterceptors,
  getDefaultHeaders,
  getErrors,
  isLoading,
  setDefaultErrorInterceptors,
  setDefaultHeaders,
  setupAxios,
  watchAPI,
  withAPI
};

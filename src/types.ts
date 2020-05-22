import { PutEffect, CallEffect } from "redux-saga/effects";
import { SuccessAC } from "./actions/success";
import { ClearErrorsAC, ErrorAC } from "./actions/error";
import { EndLoadingAC, StartLoadingAC } from "./actions/loading";

export type Action<T, S = string> = {
  type: S;
  payload: T;
};

export type APIAction = ReturnType<
  SuccessAC | ErrorAC | StartLoadingAC | EndLoadingAC | ClearErrorsAC
>;

export interface BatchCall {
  calls: Action<APICall>[];
  onFinished?: APICall["preActions"];
}

export enum CallBehavior {
  TakeEvery = "takeEvery",
  TakeFirst = "takeFirst",
  TakeLatest = "takeLatest"
}

export interface APICall {
  behavior?: CallBehavior;
  errorActions?: (apiCallResult: any) => Array<PutEffect | CallEffect>;
  errorReducer?: (data: any, state?: any) => object;
  name: string;
  params?: ((state: any) => RequestInit) | RequestInit;
  postActions?:
    | ((data: any, state: any) => Array<PutEffect | CallEffect>)
    | Array<PutEffect | CallEffect>;
  preActions?:
    | ((state: object) => Array<PutEffect | CallEffect>)
    | Array<PutEffect | CallEffect>;
  reducer?: (data: any, state?: any) => object;
  url: string;
}

export interface APIResult {
  data?: object;
  origin: string;
  reducer?: (data: any, state?: any) => object;
}

export type APIState = Record<string, any> & {
  api: {
    errors: Record<string, any[]>;
    loading: Record<string, null>;
  };
};
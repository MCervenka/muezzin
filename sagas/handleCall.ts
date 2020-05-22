import fetch from "cross-fetch";
import isCallable from "is-callable";
import { Action, APICall } from "../types";
import { all, call, put, select } from "redux-saga/effects";
import { endLoading, startLoading } from "../actions/loading";
import { Error } from "../actions/error";
import { Success } from "../actions/success";

export function* handleCall(action: Action<APICall>) {
  const origin = action.payload.name;
  yield put(startLoading({ origin }));

  const state = yield select();
  const {
    payload: {
      errorActions,
      errorReducer,
      params,
      postActions,
      preActions,
      reducer,
      url
    }
  } = action;

  const onError = function*(errorData: any) {
    yield all([
      put(
        Error({
          data: errorData,
          origin,
          reducer: errorReducer
        })
      ),
      put(endLoading({ origin }))
    ]);

    if (errorActions) {
      yield all(errorActions(errorData));
    }
  };

  try {
    if (preActions) {
      yield all(
        typeof preActions === "function" ? preActions(state) : preActions
      );
    }

    // @ts-ignore
    const response = yield call(
      fetch,
      url,
      typeof params === "function" ? params(state) : params
    );
    const data = yield response.json();

    if (response.ok) {
      yield all([
        put(
          Success({
            data,
            origin,
            reducer: reducer
          })
        ),
        put(endLoading({ origin }))
      ]);

      if (postActions) {
        yield all(
          typeof postActions === "function" ? postActions(data) : postActions
        );
      }
    } else {
      yield onError(data);
    }
  } catch (e) {
    yield onError(e);
  }
}
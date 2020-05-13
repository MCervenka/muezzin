import { Action, APICall } from "../types";
import isCallable from "is-callable";
import { all, call, put, select } from "redux-saga/effects";
import { API } from "../withAPI";
import { endLoading, startLoading } from "../actions/loading";
import { Error } from "../actions/error";
import { path } from "ramda";
import { Success } from "../actions/success";

export function* handleCall(action: Action<APICall>) {
  const origin = action.type.slice(5);
  yield put(startLoading({ origin }));

  const state = yield select();
  const {
    payload: {
      callParams,
      endpoint: endpoint,
      errorReducer,
      postActions,
      preActions,
      reducer
    }
  } = action;

  try {
    if (preActions) {
      yield all(preActions(state));
    }

    const data = yield call(path(endpoint, API) as any, {
      params: isCallable(callParams) ? callParams(state) : callParams
    });

    if (data.ok) {
      yield all([
        put(
          Success({
            data: data.body,
            origin,
            reducer: reducer
          })
        ),
        put(endLoading({ origin }))
      ]);

      if (postActions) {
        yield all(postActions(data.body));
      }
    } else {
      yield all([
        put(
          Error({
            data,
            origin,
            reducer: errorReducer
          })
        ),
        put(endLoading({ origin }))
      ]);
    }
  } catch (e) {
    yield all([
      put(
        Error({
          data: e,
          origin,
          reducer: errorReducer
        })
      ),
      put(endLoading({ origin }))
    ]);

    if (!errorReducer) {
      console.error(
        "Error occurred. Please add errorSelector if you wish to handle it within your state."
      );
    }
  }
}

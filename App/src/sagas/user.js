import { takeEvery, delay }  from 'redux-saga'
import { call, put, fork, select } from 'redux-saga/effects'
import * as ActionTypes from '../actions/ActionTypes';
import * as userApi from '../services/user';
//import { getUser, regUser } from '../actions/user';

function* get(action) {

    // Create a Request
    const { response, error } = yield call(userApi.get, action.payload);


    if(response) {
        // SUCCEED
        yield put({type: ActionTypes.GET_USER.SUCCESS, payload: { response, id: action.payload }});
    } else {
        // ERROR HAS OCCURRED
        yield put({type: ActionTypes.GET_USER.FAILURE, payload: { error }});
        if(error.code !== 'ECONNABORTED') {
            // IF IT IS NOT TIMED OUT, WAIT FOR 10 SEC, SO THAT IT DOES NOT DOS THE SERVER :)
            yield delay(1000*10);
        }
    }
}

function* reg(action) {

    const { response, error } = yield call(userApi.reg, action.payload);

    if(response) {
        yield put({type: ActionTypes.REG_USER.SUCCESS, payload: { response }});
    } else {
        yield put({type: ActionTypes.WRITE_USER.ERROR, payload: { error }});
    }
}


// ACTION WATCHERS

function* watchGet() {

    yield* takeEvery(ActionTypes.GET_USER.REQUEST, get);
}

function* watchReg() {
    yield* takeEvery(ActionTypes.REG_USER.REQUEST, reg);
}

export default function* userSaga() {
    yield fork(watchGet);
    yield fork(watchReg);
}

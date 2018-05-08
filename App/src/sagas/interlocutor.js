import { takeEvery, delay }  from 'redux-saga'
import { call, put, fork, select } from 'redux-saga/effects'
import * as ActionTypes from '../actions/ActionTypes';
import * as userApi from '../services/user';


function* getInterlocutor(action) {
    const { response, error } = yield call(userApi.get, action.payload);
    if(response) {
        yield put({type: ActionTypes.GET_INTERLOCUTOR.SUCCESS, payload: { response, id: action.payload }});
    } else {
        // ERROR HAS OCCURRED
        yield put({type: ActionTypes.GET_INTERLOCUTOR.FAILURE, payload: { error }});
        if(error.code !== 'ECONNABORTED') {
            // IF IT IS NOT TIMED OUT, WAIT FOR 10 SEC, SO THAT IT DOES NOT DOS THE SERVER :)
            yield delay(1000*10);
        }
    }
}

function* watchGetInterlocutor() {
    yield* takeEvery(ActionTypes.GET_INTERLOCUTOR.REQUEST, getInterlocutor);
}


export default function* interlocutorSaga() {
    yield fork(watchGetInterlocutor);
}

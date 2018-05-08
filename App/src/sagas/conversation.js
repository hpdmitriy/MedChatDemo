import { takeEvery, delay }  from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import {GET_CONVERSATION_LIST, GET_CONVERSATION_POSTS, DELETE_CONVERSATION} from '../actions/ActionTypes';
import {getById, findByMember, deleteById} from '../services/conversation';
//import { getConversationList, getConversationPosts } from '../actions/conversation';

function* sagaGetConversationList(action) {
    const { response, error } = yield call(findByMember, action.payload);
    if(response) {
        yield put({type: GET_CONVERSATION_LIST.SUCCESS, payload: { data: response.data, id: action.payload }});
    } else {
        yield put({type: GET_CONVERSATION_LIST.FAILURE, payload: { error }});
        if(error.code !== 'ECONNABORTED') {
            yield delay(1000*10);
        }
    }
}

function* sagaGetConversationById(action) {
    const { response, error } = yield call(getById, action.payload);

    if(response) {
        yield put({type: GET_CONVERSATION_POSTS.SUCCESS, payload: { data: response.data, id: action.payload.id }});
    } else {
        yield put({type: GET_CONVERSATION_POSTS.FAILURE, payload: { error }});
    }
}
function* sagaDeleteConversationById(action) {
    const {conversationId, assistantId} = action.payload;
    const { response, error } = yield call(deleteById, conversationId, assistantId);
    if(response) {
        yield put({type: DELETE_CONVERSATION.SUCCESS, payload: { data: response.data, id: action.payload }});
    } else {
        yield put({type: DELETE_CONVERSATION.FAILURE, payload: { error }});
    }
}


// ACTION WATCHERS

function* watchGetList() {
    yield* takeEvery(GET_CONVERSATION_LIST.REQUEST, sagaGetConversationList);
}

function* watchGetPosts() {
    yield* takeEvery(GET_CONVERSATION_POSTS.REQUEST, sagaGetConversationById);
}
function* watchDelConversation() {
    yield* takeEvery(DELETE_CONVERSATION.REQUEST, sagaDeleteConversationById);
}

export default function* conversationSaga() {
    yield fork(watchGetList);
    yield fork(watchGetPosts);
    yield fork(watchDelConversation);
}

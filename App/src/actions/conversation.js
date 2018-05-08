import {
  GET_CONVERSATION_LIST,
  GET_CONVERSATION_POSTS,
  CHANGE_CONVERSATION_CURRENT,
  ADD_CONVERSATION_POST,
  DELETE_CONVERSATION,
} from './ActionTypes';
import { createAction } from 'redux-actions';

export const getConversationList = createAction(GET_CONVERSATION_LIST.REQUEST);
export const getConversationPosts = createAction(GET_CONVERSATION_POSTS.REQUEST);
export const changeConversationCurrent = createAction(CHANGE_CONVERSATION_CURRENT);
export const deleteConversation = createAction(DELETE_CONVERSATION.REQUEST);
export const addConversationPost = createAction(ADD_CONVERSATION_POST);

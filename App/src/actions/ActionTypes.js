import createRequestTypes from '../utils/action';
/* USER */
export const GET_USER = createRequestTypes('GET_USER');
export const GET_INTERLOCUTOR = createRequestTypes('GET_INTERLOCUTOR');
export const REG_USER = createRequestTypes('REG_USER');


/* CONVERSATION */
export const GET_CONVERSATION_LIST = createRequestTypes('GET_CONVERSATION_LIST');
export const GET_CONVERSATION_POSTS = createRequestTypes('GET_CONVERSATION_POSTS');
export const CHANGE_CONVERSATION_CURRENT = 'CHANGE_CONVERSATION_CURRENT';
export const ADD_CONVERSATION_POST = 'ADD_CONVERSATION_POST';
export const DELETE_CONVERSATION = createRequestTypes('DELETE_CONVERSATION');


/* UI */
export const SHOW_CONFIRM = "SHOW_CONFIRM";
export const HIDE_CONFIRM = "HIDE_CONFIRM";
export const CHAT_SCROLLED = "CHAT_SCROLLED";
export const TOGGLE_POPUP_CHAT_VISIBLE = "TOGGLE_POPUP_CHAT_VISIBLE";


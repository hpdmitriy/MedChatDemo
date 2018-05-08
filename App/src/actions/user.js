import * as ActionTypes from './ActionTypes';
import { createAction } from 'redux-actions';

export const getUser = createAction(ActionTypes.GET_USER.REQUEST);
export const getInterlocutor = createAction(ActionTypes.GET_INTERLOCUTOR.REQUEST);
export const regUser = createAction(ActionTypes.REG_USER.REQUEST);
export const toggleLoading = createAction(ActionTypes.TOGGLE_LOADING);

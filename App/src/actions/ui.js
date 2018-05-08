import * as ActionTypes from './ActionTypes';
import { createAction } from 'redux-actions';

export const showConfirm = createAction(ActionTypes.SHOW_CONFIRM);
export const hideConfirm = createAction(ActionTypes.HIDE_CONFIRM);
export const togglePopupChatVisible = createAction(ActionTypes.TOGGLE_POPUP_CHAT_VISIBLE);
export const chatScrolled = createAction(ActionTypes.CHAT_SCROLLED);

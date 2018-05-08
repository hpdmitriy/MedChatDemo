import * as ActionTypes from '../actions/ActionTypes';

const initialState = {
  showConfirm: {
    show: false,
  },
  popUpChatOpen: false,
  modalData: null,
  chatScrolled:0,
}

export default function ui(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_CONFIRM:
      return {
        ...state,
        modalData: action.payload,
        showConfirm: {
          show: true
        }
      };
    case ActionTypes.HIDE_CONFIRM:
      return {
        ...state,
        modalData: null,
        showConfirm: {
          show: false
        }
      };
    case ActionTypes.TOGGLE_POPUP_CHAT_VISIBLE:
      return {
        ...state,
        popUpChatOpen: !state.popUpChatOpen
      };
    case ActionTypes.CHAT_SCROLLED:
      return {
        ...state,
        chatScrolled: action.payload
      };
    default:
      return state;
  }
}

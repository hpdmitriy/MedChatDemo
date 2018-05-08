import {
  GET_CONVERSATION_LIST,
  GET_CONVERSATION_POSTS,
  TOGGLE_LOADING,
  CHANGE_CONVERSATION_CURRENT,
  ADD_CONVERSATION_POST,
  DELETE_CONVERSATION
} from '../actions/ActionTypes';

const request = {
  fetching: false,
  fetched: false,
  response: null,
  error: null
};

const initialState = {
  current: null,
  prev: null,
  change: false,
  conversations: null,
  posts: null,
  newPosts: 0,
  requests: {
    fetch: {...request},
    write: {...request}
  }
};

function conversation(state = initialState, action) {
  switch (action.type) {
    case GET_CONVERSATION_LIST.REQUEST:
      return {
        ...state,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: true,
            fetched: false,
            response: null,
            error: null
          }
        }
      };
    case GET_CONVERSATION_LIST.SUCCESS:
      return {
        ...state,
        conversations: action.payload.data,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            fetched: true,
          }
        }
      };
    case GET_CONVERSATION_LIST.FAILURE:
      // FETCHING FAILED
      return {
        ...state,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            error: action.payload
          }
        }
      };

    case DELETE_CONVERSATION.REQUEST:
      return {
        ...state,
        prev: action.payload.nextCurrent,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: true,
            fetched: false,
            response: null,
            error: null
          }
        }
      };
    case DELETE_CONVERSATION.SUCCESS:
      return {
        ...state,
        conversations: action.payload.data,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            fetched: true,
          }
        }
      };
    case DELETE_CONVERSATION.FAILURE:
      // FETCHING FAILED
      return {
        ...state,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            error: action.payload
          }
        }
      };

    case GET_CONVERSATION_POSTS.REQUEST:
      return {
        ...state,
        current: action.payload.id,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: true,
            fetched: false,
            response: null,
            error: null
          }
        }
      };
    case GET_CONVERSATION_POSTS.SUCCESS:
      return {
        ...state,
        posts: action.payload.data,
        change: false,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            fetched: true,
          }
        }
      };
    case GET_CONVERSATION_POSTS.FAILURE:
      // FETCHING FAILED
      return {
        ...state,
        change: false,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            error: action.payload
          }
        }
      };
    case CHANGE_CONVERSATION_CURRENT:
      return {
        ...state,
        current: action.payload.current,
        prev: action.payload.prev || null,
        change: true,
      };
    case ADD_CONVERSATION_POST:
      return {
        ...state,
        newPosts: state.newPosts + 1
      };

    case TOGGLE_LOADING:
      return {
        ...state,
        loadingHistory: !state.loadingHistory
      };
    default:
      return state;

  }

}

export default conversation;

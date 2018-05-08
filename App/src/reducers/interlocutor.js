import * as ActionTypes from '../actions/ActionTypes';

const request = {
  fetching: false,
  fetched: false,
  response: null,
  error: null
};

const initialState = {
  name: null,
  role: null,
  id: null,
  assistants: [],
  clients: [],
  requests: {
    fetch: {...request},
    write: {...request}
  }
};

function interlocutor(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_INTERLOCUTOR.REQUEST:
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
    case ActionTypes.GET_INTERLOCUTOR.SUCCESS:
      return {
        ...state,
        ...action.payload.response.data,
        requests: {
          ...state.requests,
          fetch: {
            ...state.requests.fetch,
            fetching: false,
            fetched: true,
          }
        }
      };
    case ActionTypes.GET_INTERLOCUTOR.FAILURE:
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

    default:
      return state;

  }

}

export default interlocutor;

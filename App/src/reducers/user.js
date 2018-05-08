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
  status: 'Offline',
  requests: {
    fetch: {...request},
    write: {...request}
  }
};

function user(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_USER.REQUEST:
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
    case ActionTypes.GET_USER.SUCCESS:
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
    case ActionTypes.GET_USER.FAILURE:
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

      /*
     case ActionTypes.REG_USER.REQUEST:
     const tempUser = {
     id: '',
     name: action.payload.name,
     password: action.payload.password,
     role: action.payload.role
     };
     return {
     ...state,
     tempData: [...state.tempData, tempUser]
     };
     case ActionTypes.TOGGLE_LOADING:
     return {
     ...state,
     loadingHistory: !state.loadingHistory
     };*/
    default:
      return state;

  }

}

export default user;

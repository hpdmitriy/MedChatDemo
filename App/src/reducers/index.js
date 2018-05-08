import { combineReducers } from 'redux';
import ui from './ui';
import user from './user';
import interlocutor from './interlocutor';
import conversation from './conversation';

export default combineReducers({ui, user, interlocutor, conversation});

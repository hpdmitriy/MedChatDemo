import user from './user';
import interlocutor from './interlocutor';
import conversation from './conversation';

export default function* rootSaga() {
  yield [
    user(),
    interlocutor(),
    conversation()
  ]
}

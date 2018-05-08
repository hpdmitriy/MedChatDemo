import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {getConversationList} from '../actions/conversation';
import {chatScrolled} from '../actions/ui';
import DialogListItem from '../components/DialogListItem';
import {isAssistant} from '../utils/helpers';
import {isEmpty, filter, isNull, isUndefined, sortBy, reverse, findIndex} from 'lodash'
import {diffNewMessagesArray} from '../utils/helpers'
import Audio from '../components/Audio'
let timerId, timerSwitchTitleId;
class DialogList extends Component {
  static propTypes = {
    user: PropTypes.object,
    conversation: PropTypes.object,
    getConversationList: PropTypes.func,
    isPopup: PropTypes.bool
  };
  state = {
    getByIdInterval: null,
    newMessages: undefined,
    pageTitle: document.title,
    newTitle: null,
    hasNewMessages: false
  };

  componentWillMount() {

    console.log('###---> DialogList Mounted');
    const {id, role} = this.props.user;

    if (id !== null && role !== null) {
      this.props.getConversationList({id: id, role: role.toLowerCase()});
      if (isAssistant(role)) {
        window.addEventListener('resize', this.scrollHandler);
        timerId = setInterval(() => {
          this.props.getConversationList({id: id, role: role.toLowerCase()});
        }, 5000)
        timerSwitchTitleId = setInterval(() => {
          this.switchPageTitle();
        }, 1000)
      }
/*
      if (!isAssistant(role) && this.props.isPopup) {
        timerId = setInterval(() => {
          this.props.getConversationList({id: id, role: role.toLowerCase()});
        }, 15000)
      }
*/
      //this.props.getConversationList({id: id, role: role.toLowerCase()});
    }
  }

  componentWillUnmount() {
    console.log('###---> DialogList UnMounted');
    if (isAssistant(this.props.user.role)) {
      clearInterval(timerId);
      clearInterval(timerSwitchTitleId);
      window.removeEventListener('resize', this.scrollHandler)
    }
  }

  componentDidMount() {
    if (isAssistant(this.props.user.role)) this.scrollHandler()

  }

  showNewPostFlag = (count) => {
    const findChatButton = document.getElementById('chatButton');
    if (findChatButton && count !== 0) {
      findChatButton.innerHTML = `<div class="new-message">+${count}</div>`;
    } else {
      findChatButton.innerHTML = '';
    }
  };
  switchPageTitle = () => {
    const {newTitle, pageTitle} = this.state
    if (!isNull(newTitle)) {
      if (newTitle === document.title) {
        document.title = pageTitle
      } else {
        document.title = newTitle
      }
    } else {
      document.title = pageTitle
    }
  };

  componentWillUpdate(newProps) {
    console.log('###---> DialogList Updated');
  }

  componentWillReceiveProps(newProps) {
    if ((this.props.conversation.current === newProps.conversation.current ) && !isNull(newProps.conversation.current) && !isEmpty(newProps.conversation.conversations) && isAssistant(this.props.user.role)) {
      const {newMessages} = this.state
      const filterConversationByPosts = filter(newProps.conversation.conversations, (o) => {
        return o.id !== this.props.conversation.current && o.posts > 0
      })
      const transformFiltredConversationId = filterConversationByPosts.map((o) => `${o.id}|${o.posts}`);
      const calcNewPosts = transformFiltredConversationId.reduce((sum, item) => {
        return sum + +item.split('|')[1]
      }, 0)
      switch (true) {
        case isUndefined(newMessages)  && calcNewPosts > 0 :
          this.setState({
            newMessages: transformFiltredConversationId,
            newTitle: calcNewPosts === 0 ? null : `${calcNewPosts} new messages`,
            hasNewMessages: false
          })
          break
        case isNull(newMessages)  && calcNewPosts > 0 :
          this.setState({
            newMessages: transformFiltredConversationId,
            newTitle: calcNewPosts === 0 ? null : `${calcNewPosts} new messages`,
            hasNewMessages: true
          })
          break
        case !isNull(this.state.newMessages) && calcNewPosts === 0 :
          this.setState({
            newMessages: null,
            newTitle: null
          })
          break
        case isNull(this.state.newMessages) && calcNewPosts === 0 :
          this.setState({
            newMessages: null,
            newTitle: null,
            hasNewMessages: false
          })
          break

        case newMessages.length < transformFiltredConversationId.length :
          this.setState({
            newMessages: transformFiltredConversationId,
            newTitle: `${calcNewPosts} new messages`,
            hasNewMessages: true
          })
          break
        case newMessages.length > transformFiltredConversationId.length :
          const diffLarger = diffNewMessagesArray(newMessages,transformFiltredConversationId);
          this.setState({
            newMessages: diffLarger.length ? transformFiltredConversationId : null,
            newTitle: diffLarger.length ? `${calcNewPosts} new messages` : null,
            hasNewMessages: !!diffLarger.length
          })
          break
        case newMessages.length === transformFiltredConversationId.length :
          const diffEqually = diffNewMessagesArray(newMessages, transformFiltredConversationId);
          this.setState({
            newMessages: transformFiltredConversationId,
            newTitle: `${calcNewPosts} new messages`,
            hasNewMessages: !!diffEqually.length
          })
          break
        default:
          this.setState({
            newMessages: null,
            newTitle: null,
            hasNewMessages: false
          })
      }

    }
    if (!isAssistant(this.props.user.role) && !isEmpty(this.props.conversation.conversations) &&
      isEmpty(newProps.conversation.conversations)) {
      return window.location.reload(true)
    }
    if (!isAssistant(this.props.user.role) && this.props.isPopup && newProps.conversation.posts !== null) {
      if (!this.props.popUpChatOpen) {
        const count = newProps.conversation.posts.length - (this.props.conversation.posts === null ? newProps.conversation.posts.length : this.props.conversation.posts.length);
        if (count > 0) {
          this.setState(prevState => {
            this.showNewPostFlag(prevState.newMessages + count);
            return {newMessages: prevState.newMessages + count}
          });
        }
      }
      if (newProps.popUpChatOpen) {
        this.showNewPostFlag(0);
        return this.setState({newMessages: 0});
      }
    }
    /*
     console.log('###---> DialogList ReceiveProps');
     if(newProps.conversation.current !== this.state.conversationCurrent && !isNull(newProps.conversation.current)) {
     this.setState({conversationCurrent: newProps.conversation.current});
     }
     if (this.props.conversation.current === null &&
     newProps.conversation.current === null &&
     newProps.conversation.conversations !== null) {
     this.props.getConversationPosts(newProps.conversation.conversations[0].id)
     }
     */
  }

  scrollHandler = () => {
    const height = this.refListOfDialogs.clientHeight - 44
    return this.props.chatScrolled(this.refListOfDialogs.scrollTop + height)
  }

  render() {
    const {conversations, current} = this.props.conversation;
    const sortConversationByNewPosts = conversations !== null ? reverse(sortBy(conversations, ['posts'])) : null;
    const conversationsList = sortConversationByNewPosts !== null ? sortConversationByNewPosts.map(
      (conversation, index) => (
        <DialogListItem offsetTop={this.props.chatScrolledOffset} index={index} current={current} key={conversation.id}
                        oneConversation={conversation}/>
      )
    ) : null;
    const fullChat = isAssistant(this.props.user.role)/* || this.props.user.assistants.length > 1*/;
    if (fullChat && !this.props.isPopup) {
      return (
        <div ref={(listOfDialogs) => this.refListOfDialogs = listOfDialogs} onScroll={this.scrollHandler}
             className="chat-left">
          <div className="dialogs-list">
            {conversationsList}
          </div>

           <Audio playSound={this.state.hasNewMessages}/>

        </div>
      );
    } else {
      return null
    }

  }
}

function mapStateToProps(state) {
  return {
    //user: state.user,
    chatScrolledOffset: state.ui.chatScrolled,
    conversation: state.conversation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getConversationList: (payload) => dispatch(getConversationList(payload)),
    chatScrolled: (payload) => dispatch(chatScrolled(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);

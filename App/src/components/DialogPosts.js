import React, {PropTypes} from 'react'
import {connect} from 'react-redux';
import DialogPostsItem from '../components/DialogPostsItem';
import DialogTempPostsItem from '../components/DialogTempPostsItem';
import {isNull, has} from 'lodash';
import {API_URL_SUBSCRIBE} from '../utils/constants';
import {isAssistant} from '../utils/helpers';
import {deleteConversation} from '../actions/conversation';
import {togglePopupChatVisible} from '../actions/ui';


class DialogPosts extends React.PureComponent {
  static propTypes = {
    isPopup: PropTypes.bool,
    posts: PropTypes.array,
    userRole: PropTypes.string,
    currentConversation: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
    addConversationPost: PropTypes.func
  };
  state = {
    locale: window.location.pathname.split('/'),
    isWelcome: 'notShowing'
  };
  scrollDown = () => {
    //const chatBodyBound = this.refChatBody.getBoundingClientRect();
    const chatScrollBound = this.refChatScroll.getBoundingClientRect();
    this.refChatBody.scrollTop = (chatScrollBound.height);
  };


  componentWillMount() {
    console.log('###---> DialogPosts Willmounted');
    const id = isNull(this.props.currentConversation) ? null : this.props.currentConversation.id;
    if (id) {
      this.subscribe(this.props.currentConversation);
    }
  }

  componentDidUpdate() {
    setTimeout(this.scrollDown, 100);
    const textBox = document.querySelector('#chat-root div[role=textbox]')
    if (textBox) textBox.focus();
    //window.addEventListener("beforeunload", this.deleteEmptyAnonymousConversation);
  }

  componentWillUnmount() {
    console.log('###---> DialogPosts unmounted');
  }


  componentWillReceiveProps(newProps) {
    if (document.readyState === 'complete' &&
      this.props.isPopup &&
      Array.isArray(newProps.posts) &&
      !newProps.posts.length &&
      this.state.isWelcome === 'notShowing') {
      this.setState({
        isWelcome: 'showing'
      })
      setTimeout(this.props.togglePopupChatVisible, 45000)
    }
  }
  deleteEmptyAnonymousConversation = (e) => {
    e.preventDefault()
    debugger
    const {userRole, posts, currentConversation} = this.props;
    if(userRole === 'guest' && !posts.length && !isNull(currentConversation)) {
      const promise = new Promise((resolve, reject) => {
        this.props.deleteConversation({
          assistantId : currentConversation.assistant,
          conversationId : currentConversation.id,
          nextCurrent: currentConversation.id
        })
        setTimeout(() => {
          resolve(null);
        }, 1000);
      });
      promise
        .then(
          result => {
            debugger
            return null
          }
        );
    }
  }

  subscribe = (conversation) => {
    const role = this.props.userRole;
    const xhr = new XMLHttpRequest();
    const userId = isAssistant(role) ? conversation.assistant : conversation.client;
    xhr.open(
      "GET",
      `${API_URL_SUBSCRIBE}/${conversation.id}?r=${Math.random()}&uid=${userId}`,
      true);
    xhr.onload = () => {
      if (xhr.status !== 200) return xhr.onerror();
      //this.props.getInterlocutor(role === 'Assistant' ? currentConversation.client : currentConversation.assistant);

      const unSubscribe = JSON.parse(xhr.responseText);
      if (has(unSubscribe, userId) && unSubscribe[userId] === 'unsubscribe') {
        //xhr.abort();
      } else {
        this.props.addConversationPost();
        this.subscribe(conversation);
      }
    };
    xhr.onerror = xhr.onabort = () => {
      setTimeout(() => {
        this.subscribe(conversation)
      }, 500);
    };
    xhr.send();

  };

  render() {
    const hasMessages = this.props.posts;
    let prevMessageAuthor = null;
    const posts = !isNull(hasMessages) ? hasMessages.map(
      (message) => {
        const post = <DialogPostsItem isPopup={this.props.isPopup} key={message.id} userRole={this.props.userRole}
                                      post={message}
                                      prevMessageAuthor={prevMessageAuthor}/>;
        prevMessageAuthor = message.author.name;
        return post;
      }
    ) : null;
    if (!isAssistant(this.props.userRole) && this.props.isPopup) {
      return (

        <div ref={(chatBody) => {
          this.refChatBody = chatBody;
        }} className="pc-conversation">
          <div ref={(chatScroll) => {
            this.refChatScroll = chatScroll;
          }} className="pc-conv-inner">
            <DialogTempPostsItem visible={this.state.isWelcome === 'showing'}/>
            {posts}
          </div>
        </div>
      );
    } else {
      return (
        <div ref={(chatBody) => {
          this.refChatBody = chatBody;
        }} className="chat-body">
          <div ref={(chatScroll) => {
            this.refChatScroll = chatScroll;
          }} className="chat-scroll">
            {posts}
          </div>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    popUpChatOpen: state.ui.popUpChatOpen
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteConversation: (payload) => dispatch(deleteConversation(payload)),
    togglePopupChatVisible: () => dispatch(togglePopupChatVisible())
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(DialogPosts);



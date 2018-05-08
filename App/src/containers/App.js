import React, {Component, PropTypes} from 'react';
import DialogList from '../components/DialogList';
import Dialog from '../components/Dialog';
import PopUpChatButton from '../components/PopUpChatButton';
import Confirm from '../components/Confirm';
import {connect} from 'react-redux';
import {getUser} from '../actions/user';
import {isEmpty, isNull} from 'lodash';
import {getCookie, isAssistant} from '../utils/helpers';
import {togglePopupChatVisible} from '../actions/ui';

import './AppStyle.css'

class App extends Component {
  static propTypes = {
    isPopup: PropTypes.bool,
  };
  state = {
    popUpChatOpen: false,
    userId: /*!isEmpty(window.location.search) ? window.location.search.match(/(\??uid=|&?uid=)([a-zA-Z0-9]+)(.*)/i)[2] :*/ null,
    findCookie:getCookie('dataChat') || null,
    userData: null,
  };


  componentWillMount() {
    const userCookie = this.state.findCookie;
    const userMatches = !isNull(userCookie) ? userCookie.match(/(.*)s:\d+:"([^"]+)/) : null;
    const userData = !isNull(userMatches) ? userMatches[userMatches.length -1] : null;
    this.setState({userData});
    if (this.state.userId !== this.props.user.id) {
      this.props.userEvents.get(userId, null);
    }
    if (userData) {
      this.props.userEvents.get(userData);
    }

  }
  componentDidMount() {
    this.popUpChatOpenListner()
  }
  popUpChatOpenListner = () => {
    const {isPopup} = this.props;
    const chatOpenLink = document.querySelectorAll('a.chat-link[href="javascript:;"]')
    if(isPopup && chatOpenLink.length) {
      chatOpenLink.forEach((link) =>{
        link.addEventListener('click', this.chatToggle)
      })
    }
  }

  componentWillReceiveProps(newProps) {

    console.log('###---> App ReceiveProps', newProps);
  }

  componentWillUnmount() {
    const {isPopUp} = this.props;
    const chatOpenLink = document.querySelectorAll('a.chat-link[href="javascript:;"]')
    if(isPopUp && chatOpenLink.length) {
      chatOpenLink.forEach((link) =>{
        link.removeEventListener('click', this.chatToggle)
      })
    }
    console.log('###---> App Unmounted');
  }
  componentWillUpdate(newProps) {
  }
  chatToggle = () => {
    return this.props.togglePopupChatVisible()
  };
  render() {
    if (isNull(this.state.userId) && isNull(this.state.userData) && this.props.user.requests.fetch.fetched) {
      return (<div className="alert alert-danger" role="alert"><strong>No active chats!</strong></div>)
    }
    if ((isNull(this.props.user.name) || this.props.user.name === "CastError" && this.props.user.requests.fetch.fetched) && this.props.user.requests.fetch.fetched) {
      return (<div className="alert alert-danger" role="alert"><strong>Invalid user id.</strong> <a href="/">Please sign in
          again. </a></div>)
    }
    if (this.props.user.requests.fetch.fetched && this.props.isPopup && isAssistant(this.props.user.role)) {
      return null
    }
    if (this.props.user.requests.fetch.fetched) {
      const fullChat = isAssistant(this.props.user.role) || this.props.user.assistants.length > 1;
      if ((isAssistant(this.props.user.role) && !isEmpty(this.props.user.clients)) ||
        (!isAssistant(this.props.user.role) && !isEmpty(this.props.user.assistants))) {
        if (this.props.isPopup && !isAssistant(this.props.user.role)) {
          return (
            <div>
              <PopUpChatButton>
                <div
                  onClick={this.chatToggle}
                  ref={(chatPopupToggle) => this.refChatPopupToggle = chatPopupToggle}
                  className={`chat-button ${this.props.popUpChatOpen ? 'chatIsOpen' : ''}`} id="chatButton">
                </div>
              </PopUpChatButton>
              <div
                ref={(chatPopup) => {
                  this.refChatPopup = chatPopup
                }}
                className={`popup-chat ${!this.props.popUpChatOpen ? 'closed' : ''}`}>
                <DialogList
                  popUpChatOpen={this.props.popUpChatOpen}
                  newMessageElem={this.refChatPopupToggle}
                  isPopup
                  user={this.props.user}
                  key={this.props.user.id}/>
                <Dialog isPopup user={this.props.user}/>
                <Confirm/>

              </div>
            </div>
          )
        } else {
          return (
            <div className={`chat-wrap full-chat ${fullChat ? 'assistant-chat' : 'no-sidebar'}`}>
              <DialogList isPopup={false} user={this.props.user} key={this.props.user.id}/>
              <Dialog isPopup={false} user={this.props.user}/>
              <Confirm/>

            </div>
          );
        }

      } else {
        return (
          <div className="alert alert-danger" role="alert"><strong>No active chats!!</strong></div>
        );
      }
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    popUpChatOpen: state.ui.popUpChatOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userEvents: {
      get: (payload) => dispatch(getUser(payload)),
    },
    togglePopupChatVisible: () => dispatch(togglePopupChatVisible())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, {PropTypes, PureComponent} from 'react';
import DialogList from '../components/DialogList';
import Dialog from '../components/Dialog';
import PopUpChatButton from '../components/PopUpChatButton';
import Confirm from '../components/Confirm';
import {connect} from 'react-redux';
import {getUser} from '../actions/user';
import {isEmpty, isNull} from 'lodash';
import {isAssistant} from '../utils/helpers';
import {togglePopupChatVisible} from '../actions/ui';
import './AppStyle.css'

//const searchQuery = window.location.search;
//const userId = !isEmpty(searchQuery) ? searchQuery.match(/(\??uid=|&?uid=)([a-zA-Z0-9]+)(.*)/i)[2] : null;
//const userCookie = getCookie('chatData') || '8b36ceabb70ab23210ceabb18c271b067e5ce2d5779b90f9661a99e9b1d8d5a8a:2:{i:0;s:8:"dataChat";i:1;s:100:"HRYGNBcELCZBQHBGQUIrHEYgEC4OZkhSJC1UDzQaWmAgGlI3bzFJAxZJZTMSCCsNWD4=afa8017912b29b3e4d20b4d86279655c";}';
//const userCookie = getCookie('chatData') || '6c7065b2b78d8578fba85df8ffa50619fcbf51e9d5029aa1ee6a89c79e20de8ca:2:{i:0;s:8:"dataChat";i:1;s:164:"HRYGNBcELCZBQHZGQUIrHEYgEC4OZkhSNShNDz9WAmB5S0I2WCx3CVgWZUhUNSMXEyYEFxV0W1UdAioYMBMeEQBdRGAMWmA0GkQsTipECEA9Jh8TR3hBOzAZCkQsGFoaUz4=cd82c16fcdeb3dcdb048586cf02c531b";}';
// const userCookie = getCookie('chatData') || '7693af3b445706cb94b043758794644e653d6ac9a96a48ece5269d3f51537d1fa:2:{i:0;s:8:"dataChat";i:1;s:112:"HRYGNBcELCZBQHdGQUIrHEYgEC4OZkhSJDpKDylMFywhSxtnSC1AFGYcKxdUX2AiCTADEEM5F0BMDA==c8e1275c1e2997fb062c9be4afce127b";}';
//const userCookie = getCookie('dataChat') || null;
//const userMatches = !isNull(userCookie) ? userCookie.match(/(.*)s:\d+:"([^"]+)/) : null;
//const userData = !isNull(userMatches) ? userMatches[userMatches.length -1] : null;

class App extends PureComponent {
  static propTypes = {
    isPopup: PropTypes.bool,
  };
  state = {
    popUpChatOpen: false,
    userId: /*!isEmpty(window.location.search) ? window.location.search.match(/(\??uid=|&?uid=)([a-zA-Z0-9]+)(.*)/i)[2] : */null,
    assistantCookie: 'a2e8982a2d8df5e02d3a4e362f71dcb895cb1bdbf34d23ae37b0719fab512257a:2:{i:0;s:8:"dataChat";i:1;s:112:"HRYGNBcELCZBQHBGQUIrHEYgEC4OZkhSJDpKDylMFywhSxtnSC1AFGYcKxdUX2AiCTADEEM5F0BMDA==ba751eeaeb934f5e7bde03c440bac7e2";}', //Chrome
    patientCookie: '2b23237f68d1d8365d3c888fb32fc603a9e2a5eeb14f148ce6c2567ea3d1f94ca:2:{i:0;s:8:"dataChat";i:1;s:248:"HRYUMhcFEQsHWHlIBVVtQVEMRCZYd0ITXH1YBW4NT3tkXAB2DmhDVQxKcUdUSWAEDyYZF3k5FFFMS2EsMRcDEWlfBG8AEyBgDAR2DT0cUlUQc0dPXHNWTXBZVVFrQQ1YRGFHZgcDADtrCTZdVHh3DkIgTioHShYSNAEfFjYCFDcjBxViShhMEDAYLQEEBCdNKDtVE2BvS3Y2TjdWElUdM1AL2e73b69b5ca68480fb712a714b97bda2";}',
    userData: null,
  };


  componentWillMount() {
    const userCookie = this.props.isPopup || window.location.search === '?role=patient' ? this.state.patientCookie : this.state.assistantCookie;
    const userMatches = !isNull(userCookie) ? userCookie.match(/(.*)s:\d+:"([^"]+)/) : null;
    const userData = !isNull(userMatches) ? userMatches[userMatches.length - 1] : null;
    this.setState({userData});
    console.log('###---> app mounted', userData);
    if (this.state.userId !== this.props.user.id) {
      this.props.userEvents.get(userId, null);
    }
    if (userData) {
      this.props.userEvents.get(userData);
    }
  }

  componentWillReceiveProps(newProps) {

    console.log('###---> App ReceiveProps', newProps);
  }

  componentWillUnmount() {
    console.log('###---> AppDev Unmounted');
  }

  componentWillUpdate(newProps) {
    /*
     const you = document.getElementById('Uname');
     if(!isNull(newProps.user.name)) {
     you.innerHTML = newProps.user.name;
     }
     */
  }

  chatToggle = () => {
    //return this.setState({popUpChatOpen: !this.state.popUpChatOpen})
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
      return (
        <div className="alert alert-danger" role="alert"><strong>No active chats!!!</strong></div>
      );
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

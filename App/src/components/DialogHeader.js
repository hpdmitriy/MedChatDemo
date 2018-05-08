import React, {PropTypes, PureComponent} from 'react'
import {getInterlocutor} from '../actions/user';
import {connect} from 'react-redux';
import {isNull} from 'lodash';
import {isAssistant} from '../utils/helpers';
import {togglePopupChatVisible} from '../actions/ui';
import {getContentByLocale} from '../utils/helpers';
let timerId = null;
class DialogHeader extends PureComponent {
  static propTypes = {
    interlocutor: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
    getInterlocutor: PropTypes.func,
    currentConversation: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.object]),
    userRole: PropTypes.string,
    newPosts: PropTypes.number,
    isPopup: PropTypes.bool,
    userStatus: PropTypes.oneOfType([PropTypes.oneOf([null]), PropTypes.string]),
  };
  state = {
    chatDialogClose: false,
  }

  componentDidUpdate() {
    if (!isNull(this.props.currentConversation) && isNull(timerId)) {
        timerId = setInterval(() => {
          this.props.getInterlocutor(isAssistant(this.props.userRole) ? this.props.currentConversation.client : this.props.currentConversation.assistant);
        }, 20000)
      }
  }
  componentWillUnmount() {
    if (!isAssistant(this.props.userRole)) {
      clearInterval(timerId);
    }
  }

  componentWillReceiveProps(newProps) {
    console.log('###---> DialogHeader ReceiveProps');
    const {currentConversation} = newProps;
    if(isNull(currentConversation)) {
      return null
    } else if(isNull(this.props.currentConversation) && !isNull(currentConversation)) {
      this.props.getInterlocutor(isAssistant(this.props.userRole) ? currentConversation.client : currentConversation.assistant);
    } else if(this.props.currentConversation.id !== currentConversation.id) {
      this.props.getInterlocutor(isAssistant(this.props.userRole) ? currentConversation.client : currentConversation.assistant);
    } else if(this.props.newPosts !== newProps.newPosts) {
      this.props.getInterlocutor(isAssistant(this.props.userRole) ?
        this.props.currentConversation.client : this.props.currentConversation.assistant);
    }
  }
  closeChat = () => {
    this.props.togglePopupChatVisible()
  };
  showChatSidebar = () => {
    const chatSideBar = document.querySelector('#chat-root .chat-left');
    if(chatSideBar) {
      if(chatSideBar.classList.contains('active')){
        chatSideBar.classList.remove('active');
      } else {
        chatSideBar.classList.add('active');
      }
    }
    return this.setState({chatDialogClose: !this.state.chatDialogClose})
  };
  render() {
    const {name, status, role} = this.props.interlocutor;

    if(!isAssistant(this.props.userRole) && this.props.isPopup) {
      return(
        <div className="pc-top">
          <div className="pc-top-name">
            <div>
              <i className="user-avatar" href="#"><img
                src={isAssistant(this.props.userRole) ? 'https://medessentially.com/static/assistant/images/alien_none_photo_96.png' : 'https://chat.medessentially.com/images/m_none_photo_96.png'} /></i>
              <div style={{marginLeft: '5px'}} className="ctr-all">
                <span style={{'display': 'block'}} className="crt-name">{getContentByLocale(window.location.pathname, 'assistant_name')}</span>
                <span style={{'display': 'block'}} className="crt-category">{getContentByLocale(window.location.pathname, 'online')}</span>
              </div>
            </div>
            <button type="button" onClick={this.closeChat} className="popup-close"/>
          </div>
        </div>
      )
    } else {
      return (
        <div className="cr-top">
            <div>
              <i className="user-avatar" href="">
                <img
                  src={isAssistant(this.props.userRole) ? 'https://medessentially.com/static/assistant/images/alien_none_photo_96.png' : 'https://chat.medessentially.com/images/m_none_photo_96.png'} />
              </i>
              <div style={{marginLeft: '5px'}} className="ctr-all">
                <span className="crt-name">{!isAssistant(this.props.userRole) ? getContentByLocale(window.location.pathname, 'assistant_name') : isNull(name) ? 'User' : name}</span>
                <span className="crt-category">{getContentByLocale(window.location.pathname, role)}</span>
              </div>
            </div>
            <div className="statusWrap">
              <div className="crt-status">{getContentByLocale(window.location.pathname, isAssistant(this.props.userRole) ? status: 'online')}</div>
              {isAssistant(this.props.userRole) ?
                <div>
                  <div style={{'display': this.state.chatDialogClose ? 'none' : 'block'}} onClick={this.showChatSidebar} className="chat-hamburger open-dialogs">
                    <span/>
                  </div>
                  <div style={{'display': this.state.chatDialogClose ? 'block' : 'none'}} onClick={this.showChatSidebar} className="chat-dialog-close"/>
                </div> : null
              }
            </div>
          </div>
      );
    }
  }

}
function mapStateToProps(state) {
  return {
    interlocutor: state.interlocutor,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getInterlocutor: (payload) => dispatch(getInterlocutor(payload)),
    togglePopupChatVisible: () => dispatch(togglePopupChatVisible())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogHeader);


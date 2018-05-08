import React, {PropTypes, PureComponent} from 'react';
import {connect} from 'react-redux';
import {changeConversationCurrent, deleteConversation} from '../actions/conversation';
import {showConfirm} from '../actions/ui';
import {getInterlocutor} from '../actions/user';
import {API_URL_CONVERSATION} from '../utils/constants';
import {isAssistant, getPrevConversation, getNotEmptyConversation} from '../utils/helpers';

class DialogListItem extends PureComponent {
  static propTypes = {
    key: PropTypes.string,
    index: PropTypes.number,
    oneConversation: PropTypes.object,
    user: PropTypes.object,
    changeConversationCurrent: PropTypes.func
  };
  state = {
    unread: 0,
  };

  componentWillReceiveProps(newProps) {

  }

  /*    shouldComponentUpdate(nextProps) {

   const checkUpdate = this.props.oneConversation.posts !== nextProps.oneConversation.posts ||
   this.props.user.id !== nextProps.user.id || nextProps.oneConversation.id !== this.props.conversation.current;
   return  checkUpdate;

   }*/


  switchDialog = (del = false) => {
    let data = {};
    if (this.props.oneConversation.id === this.props.current && !del) {
      return null
    }
    data.author = this.props.user.id;
    data.conversation = this.props.conversation.current;
    data.unsubscribe = true;
    data.text = 'unsubscribe';
    const nextCurrent = getPrevConversation(this.props.conversation.conversations, this.props.oneConversation.id)

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL_CONVERSATION}/`, true);
    let formData = new FormData();
    formData.append("text", data.text);
    formData.append("author", data.author);
    formData.append("conversation", data.conversation);
    formData.append("unsubscribe", data.unsubscribe);
    xhr.send(formData);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status !== 200) {
        alert(xhr.status + ': ' + xhr.statusText);
      } else {
        const interlocutor = isAssistant(this.props.user.role) ? this.props.oneConversation.client : this.props.oneConversation.assistant;
        /*
         this.props.getInterlocutor(interlocutor);
         */
        if(!del) {
          this.props.changeConversationCurrent({
            current: this.props.oneConversation.id,
            prev: del ? nextCurrent : null
          });
        }
        return false;
      }
    }
  };
  deleteAllEmptyDialogs = () => {
    const data = {
      type: 'DELETE_DIALOG',
      handler: this.deleteConversation,
      handlerArgs: {
        nextCurrent: getNotEmptyConversation(this.props.conversation.conversations),
        conversationId: 'all_empty',
        assistantId: this.props.oneConversation.assistant,
      },
      unSubscribe: () => {
        return this.switchDialog(true)
      }
    };
    setTimeout(
      this.props.showConfirm,
      200,
      data
    );
  };
  deleteDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.switchDialog();
    const data = {
      type: 'DELETE_DIALOG',
      handler: this.deleteConversation,
      handlerArgs: {
        nextCurrent: getPrevConversation(this.props.conversation.conversations, this.props.oneConversation.id),
        conversationId: this.props.oneConversation.id,
        assistantId: this.props.oneConversation.assistant,
      },
      unSubscribe: () => {
        return this.switchDialog(true)
      }
    };
    setTimeout(
      this.props.showConfirm,
      200,
      data
    );
  };
  deleteConversation = (payload) => {
    this.props.deleteConversation(payload)
  }

  render() {
    const {role} = this.props.user;
    const unread = this.props.oneConversation.posts;
    const userRole = isAssistant(role) ? 'client' : 'assistant';
    const members = this.props.oneConversation.name.split('|');
    const active = this.props.oneConversation.id === this.props.conversation.current;

    const delStyle = {
      fontSize: '24px',
      color: 'red',
      width: '16px',
      height: '16px',
      position: 'absolute',
      lineHeight: '16px',
      top: '5px',
      right: '5px',
      zIndex: 999
    };
    return (
      <div>
        {this.props.index === 0 ?
          <div style={{top: this.props.offsetTop}} className="dialogs-admin-tools">
            <button onClick={this.deleteAllEmptyDialogs} className="btn btn-danger" type="button">
              Delete all empty guest chats
            </button>
          </div> : null
        }
      <div style={{
        background: !active && this.props.oneConversation.isNewConversation ? '#dff0d8' : active ? '#e7f4ff' : 'white'
      }} onClick={() => this.switchDialog()} className={active ? 'cl-assistant active' : 'cl-assistant'}>
        {isAssistant(role)  ? <span onClick={this.deleteDialog} style={delStyle}>&times;</span> : null }
        <div className="user-block">
          <div className="user-avatar" href="#">
            <img src="http://via.placeholder.com/96x96"/>
          </div>
          <span className="user-name">{isAssistant(role) ? members[0] : members[1]}</span>
          <span className="user-category">{userRole}  {!PRODUCTION ? this.props.oneConversation.id : null}</span>
        </div>
        {
          unread && !active ? <span className="unread">+{unread}</span> : null
        }
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation: state.conversation
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeConversationCurrent: (payload) => dispatch(changeConversationCurrent(payload)),
    deleteConversation: (payload) => dispatch(deleteConversation(payload)),
    getInterlocutor: (payload) => dispatch(getInterlocutor(payload)),
    showConfirm: (payload) => dispatch(showConfirm(payload)),
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(DialogListItem);

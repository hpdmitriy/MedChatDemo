import React, {PureComponent, PropTypes} from 'react';
import DialogHeader from '../components/DialogHeader';
import DialogFooter  from '../components/DialogFooter';
import DialogPosts from '../components/DialogPosts';
import {getConversationPosts, addConversationPost} from '../actions/conversation';
import {connect} from 'react-redux';
import {find, findIndex, isNull, has, isEmpty} from 'lodash';


class Dialog extends PureComponent {
  static propTypes = {
    isPopup: PropTypes.bool,
    interlocutor: PropTypes.object,
    conversation: PropTypes.object,
    getConversationPosts: PropTypes.func,
  };
  state = {
    currentConversation: null
  };

  componentWillMount() {
    console.log('###---> Dialog Mount');
    const {current, change} = this.props.conversation;
    if (!isNull(current)) {
      console.log('~~~###---> Dialog getConversationPosts');
      this.props.getConversationPosts({id:current, change:change});
    }
  }

  componentWillReceiveProps(newProps) {
    console.log('###---> Dialog ReceiveProps');
    const {current, conversations, prev, change} = newProps.conversation;
    const findActive = findIndex(conversations, (c) => c.isActiveConversation === true);
    if(!!~findActive && isNull(current) && isNull(prev)) {
      this.props.getConversationPosts({id:conversations[findActive].id, change:change});
      return this.setState({currentConversation: conversations[findActive]})
    }
    if (isNull(this.props.conversation.current) && !isNull(conversations) && isNull(current) && isNull(prev)) {
      this.props.getConversationPosts({id:conversations[0].id, change:change});
      return this.setState({currentConversation: conversations[0]})
    }
    if (!isNull(this.props.conversation.current) && this.props.conversation.current !== current && !isNull(current) && isNull(prev) && prev !== 'last_chat') {
      const findConversation = find(newProps.conversation.conversations, ['id', newProps.conversation.current]);
      this.props.getConversationPosts({id:findConversation.id, change:change});
      return this.setState({currentConversation: {...findConversation}});
    }
    if (!isNull(prev) && this.props.conversation.prev !== prev && prev !== 'last_chat') {
      const findConversation = find(newProps.conversation.conversations, ['id', newProps.conversation.prev]);
      this.props.getConversationPosts({id:findConversation.id, change:change});
      return this.setState({currentConversation: {...findConversation}});
    }
    if(this.props.conversation.newPosts !== newProps.conversation.newPosts) {
      this.props.getConversationPosts({id:this.props.conversation.current, change:change});
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    console.log('###---> Dialog Unmaunt');
  }

  checkStatus = () => {
    const {posts} = this.props.conversation
    if(isNull(posts)) return null
    const {role} = this.props.user
    if (role === 'guest' || role === 'patient') {
      const statusOnline = findIndex(posts, function(post) { return post.author.role === 'assistant' && post.author.status === 'Online' })
      return statusOnline === -1 ? 'Offline' : 'Online'
    }
    return null
  }


  render() {
    if (this.props.conversation.prev === 'last_chat') {
      return (<div style={{
        position: 'relative',
        zIndex: 10,
        height: '55px',
        marginBottom: 0,
      }} className="alert alert-danger" role="alert"><strong>No active chats!!</strong></div>)
    } else {
    return (
      <div className="chat-right">
        <DialogHeader
          newMessageElem={this.props.newMessageElem}
          isPopup={this.props.isPopup}
          newPosts={this.props.conversation.newPosts}
          currentConversation={this.state.currentConversation}
          userRole={this.props.user.role}
        />
        <DialogPosts
          isPopup={this.props.isPopup}
          addConversationPost={this.props.addConversationPost}
          currentConversation={this.state.currentConversation}
          key={!isNull(this.state.currentConversation) ? this.state.currentConversation.id : '' }
          posts={this.props.conversation.posts}
          userRole={this.props.user.role}/>
        <DialogFooter isPopup={this.props.isPopup} key={this.props.conversation.newPosts}
                      newPosts={this.props.conversation.newPosts}/>
      </div>
    );
    }
  }
}

function mapStateToProps(state) {
  return {
    conversation: state.conversation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getConversationPosts: (payload) => dispatch(getConversationPosts(payload)),
    addConversationPost: (payload) => dispatch(addConversationPost()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);

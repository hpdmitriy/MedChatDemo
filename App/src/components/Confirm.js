import React, {PropTypes} from 'react'
import {connect} from 'react-redux';
import {hideConfirm} from '../actions/ui';
import {has, isNull} from 'lodash';

const modalText = {
  'DELETE_DIALOG': {
    title: 'Are you sure you want to delete this conversation',
    text: 'The chat will be completely deleted, including all messages, attachments and personal data of the patient'
  }
}
class Confirm extends React.PureComponent {
  static propTypes = {
    ui: PropTypes.object,
    hideConfirm: PropTypes.func,
  };
  state = {
    showSpinner: false
  }
  hideModal = () => {
    this.props.hideConfirm()
  }
  componentWillReceiveProps(newProps) {
    const {conversationFetch, conversationsLength} = this.props;
    const {show} = this.props.ui.showConfirm;
    if(show && !newProps.conversationFetch.fetching && newProps.conversationFetch.fetched) {
      this.setState({
        showSpinner: false
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if(prevState.showSpinner && !this.state.showSpinner) {
      this.hideModal()
    }
  };

  continueHandler = () => {
    const {modalData} = this.props.ui;
    if(isNull(modalData)) {
      return null;
    } else {
      if(has(modalData, 'handler') && typeof modalData.handler === 'function') {
        this.setState({
          showSpinner: true
        })
        if(has(modalData, 'unSubscribe') && typeof modalData.unSubscribe === 'function') {
          modalData.unSubscribe(true);
        }
        return modalData.handler(modalData.handlerArgs)
      } else {
        return null
      }
    }
  }

  render() {
    const {show} = this.props.ui.showConfirm;
    const {modalData} = this.props.ui;
    const {conversationFetch} = this.props;

    return (<div style={{'display': show ? 'block' : 'none', 'background': 'rgba(0,0,0,0.5)'}} className={`modal fade ${show ? 'in' : ''}`} tabIndex="-1"
                 role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button onClick={this.hideModal} type="button" className="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 className="modal-title">{has(modalData, 'type') ? modalText[modalData.type].title: ''}</h4>
          </div>
          <div className="modal-body">
            <p>{has(modalData, 'type') ? modalText[modalData.type].text: '&hellip;'}</p>
            <div className="text-center" style={{height: '32px'}}>
              {conversationFetch.fetching && this.state.showSpinner ? <img src={PRODUCTION ? '//chat.medessentially.com/images/ajax-loader.gif' : '/images/ajax-loader.gif'} alt=""/> : null}
            </div>
            {
              conversationFetch.fetched && !isNull(conversationFetch.error) ?
                <div className="alert alert-danger" role="alert">Request Error</div> : null
            }
          </div>
          <div className="modal-footer">
            <button onClick={this.hideModal} type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
            <button onClick={this.continueHandler} type="button" className="btn btn-danger">Continue</button>
          </div>
        </div>
      </div>
    </div>)
  }
}


function mapStateToProps(state) {
  return {
    //user: state.user,
    ui: state.ui,
    conversationFetch: state.conversation.requests.fetch,
    conversationsLength: Array.isArray(state.conversation.conversations) ? state.conversation.conversations.length : 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideConfirm: () => dispatch(hideConfirm()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);

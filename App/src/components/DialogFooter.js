import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import DropZone from 'react-dropzone';
import {API_URL_CONVERSATION} from '../utils/constants';
import {getContentByLocale} from '../utils/helpers';
import {isEmpty, find, union, pullAt} from 'lodash'
import Emoji from './Emoji'

class DialogFooter extends React.PureComponent {
  static propTypes = {
    newPosts: PropTypes.number,
    isPopup: PropTypes.bool
  };
  state = {
    accepts: `.jpeg, .jpg, .png, .gif, .doc, .docx, .xls, .xlsx, .txt, .avi, .mp4, .mp3, .pdf, .ppt, .odt, .odp, .ods`,
    maxSize: 20971520,
    accepted: [],
    rejected: [],
    dropZoneStyle: {
      width: 20,
      height: 20,
      background: 'red',
      border: "1px solid black"
    },
    locale: window.location.pathname.split('/'),
    showEmoji: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.newPosts !== nextProps.newPosts) {
      //this.clearAttachment();
    }
  }

  sendMessageFromEnter = (e) => {
    if (e.charCode === 13 && !e.shiftKey) {
      this.sendMessage();
    }
  };
  clearAttachment = () => {
    this.setState({
      accepted: [],
      rejected: []
    });
    debugger
  };
  sendMessage = () => {
    const {accepted} = this.state;
    const data = {
      text: this.refTextBox.innerHTML,
      author: this.props.user.id || null,
      conversation: this.props.conversation.current || null,
    };
    const text = isEmpty(data.text) && !isEmpty(accepted) ? '|||' : data.text;
    const xhr = new XMLHttpRequest();
    if (!isEmpty(text)) {
      this.refSendBtn.disabled = true;
      xhr.open("POST", `${API_URL_CONVERSATION}/`, true);
      let formData = new FormData();
      formData.append("text", text);
      formData.append("author", data.author);
      formData.append("conversation", data.conversation);
      if (!isEmpty(accepted)) {
        for (let i = 0; i < accepted.length; i++) {
          formData.append('attachments', accepted[i])
        }
      }

      //xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
      xhr.send(formData);
      xhr.onreadystatechange = () => { // (3)
        if (xhr.readyState !== 4) return;
        this.refSendBtn.disabled = false;
        if (xhr.status !== 200) {
          if(xhr.status === 0) {
            alert('Your browser blocks uploading files, disable the lock or try again in another browser')
          } else {
            alert(xhr.status + ': ' + xhr.statusText);
          }
        } else {
          this.refTextBox.innerHTML = '';
          this.refPostAttachments.innerHTML = '';

          return false;
        }
      }
    }
  };

  removeAccepted = (i) => {
    this.setState((state) => {
      pullAt(state.accepted, [i]);
      return {
        accepted: union([], state.accepted)
      }
    });
  };

  removeRejected = (i) => {
    this.setState((state) => {
      pullAt(state.rejected, [i]);
      return {
        rejected: union([], state.rejected)
      }
    });
  };

  onDrop = (accepted, rejected) => {
    const stateAccepted = this.state.accepted;
    const statePejected = this.state.rejected;
    if (!isEmpty(accepted)) {
      if (isEmpty(stateAccepted)) {
        this.setState((state, props) => {
          const arr = union([], state.accepted, accepted);
          return {
            accepted: arr
          }
        });

      } else {
        const already = find(stateAccepted, (f) => f.name === name && f.size === size);
        if (!already) {
          this.setState((state, props) => {
            const arr = union([], state.accepted, accepted);
            return {
              accepted: arr
            }
          });
        } else {
          this.setState((state, props) => {
            const arr = union([], state.rejected, accepted);
            return {
              rejected: arr
            }
          });
        }
      }
    } else if (!isEmpty(rejected)) {
      this.setState((state, props) => {
        const arr = union([], state.rejected, rejected);
        return {
          rejected: arr
        }
      });
    }
  };

  onDropRejected = (rejected) => {
    return console.log('Maximum file upload size is 20MB');
  }
  insertEmoji = (code) => {
    const text = this.refTextBox.innerHTML
    this.refTextBox.innerHTML = `${text}&#x${code}`
  }
  showEmojiHandler = () => {
    const {showEmoji} = this.state;
    this.setState({showEmoji: !showEmoji})
  }
  componentWillUpdate(prevProps, prevState) {
  }

  render() {
    console.log('Accepptteedd', this.state.accepted);

    return (
      <div>
        <div className="cr-bottom">
          { this.props.isPopup ?
            <div onClick={this.showEmojiHandler} className="crb-button crb-emoji" type="button">
              <Emoji visible={this.state.showEmoji} insertFunc={this.insertEmoji}/>
            </div> :
            <div onClick={this.showEmojiHandler} className="crb-button crb-smile" type="button">
              <Emoji visible={this.state.showEmoji} insertFunc={this.insertEmoji}/>
            </div>
          }

          <div onClick={() => {
            this.refDropZone.open()
          }} className="crb-button crb-attach">
            <DropZone
              maxSize={this.state.maxSize}
              onDrop={this.onDrop.bind(this)}
              onDropRejected={this.onDropRejected}
              accept={this.state.accepts}
              style={{}}
              multiple={false}
              ref={(dropZone) => {
                this.refDropZone = dropZone;
              }}
            />
          </div>
          <div className="crb-textarea-wrap">
            <div onKeyPress={(e)=> this.sendMessageFromEnter(e)} ref={(textBox) => {
              this.refTextBox = textBox;
            }} className="crb-textarea" tabIndex="0" contentEditable="true" role="textbox" aria-multiline="true" placeholder={getContentByLocale(window.location.pathname, 'write_a_reply')}>

            </div>
          </div>
          <button ref={(sendBtn) => {
            this.refSendBtn = sendBtn;
          }} onClick={this.sendMessage} className="crb-button crb-send"/>
        </div>
        <div ref={(postAttachments) => {
          this.refPostAttachments = postAttachments;
        }} className={`file-list ${!this.props.isPopup ? 'chat-file-list' : ''}`}>
          {
            this.state.accepted.map((f, i) => {
              return (
                <div key={f.name} className="file-item ">
                  <span>{f.name}</span>
                  <button onClick={() => this.removeAccepted(i)} className="file-delete "/>
                </div>
              )
            })
          }
          {
            this.state.rejected.map(
              (f, i) => {
                return (
                  <div style={{background: "#f3d3d3"}} key={f.name} className="file-item ">
                    <span>{f.name}</span>
                    <button onClick={() => this.removeRejected(i)} className="file-delete "/>
                  </div>
                )
              }
            )
          }
        </div>
        {
          this.state.rejected.length ? <div className="uploader-rules"><small>{getContentByLocale(window.location.pathname, 'file_size')}</small></div> : null
        }

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    conversation: state.conversation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    /*
     getConversationPosts: (payload) => dispatch(getConversationPosts(payload)),
     getInterlocutor: (payload) => dispatch(getInterlocutor(payload))
     */


  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogFooter);

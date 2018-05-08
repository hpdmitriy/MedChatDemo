import React, {PropTypes} from 'react'
import moment from 'moment';
import {isNull} from 'lodash';
import {isAssistant, emojifyString, getContentByLocale} from '../utils/helpers';
function createMarkup(text) {
  return {__html: text};
}


function DialogPostsItem(props) {
  const postContinue = props.post.author.name === props.prevMessageAuthor;
  const dopStyle = {marginTop: postContinue ? '-20px' : 0};
  const text = emojifyString(props.post.text);
  if (props.isPopup && !isAssistant(props.userRole)) {
    if (props.userRole !== props.post.author.role) {
      return(
        <div data-author={props.post.author.role} style={dopStyle} className="cs-message-wrap right">
          {text !== '|||' ?
          <div dangerouslySetInnerHTML={createMarkup(text)} style={{padding: 10}} className={`cs-message-text right talk-bubble right-top border ${postContinue ? '' : 'tri-right' }`} /> : null}
          {
            !isNull(props.post.attachments) ?
              props.post.attachments.map(attach => {
                return (<div style={{padding: 10}} className={`cs-message-text right talk-bubble right-top border ${postContinue ? '' : 'tri-right' }`} key={attach.newName}>
                  <a className="cs-attached" href={`http://chat.medessentially.com${attach.url}`}>{attach.oldName}</a>
                </div>)
              }) : null
          }
        </div>
      )
    } else {
        return(
          <div data-author={props.post.author.role} style={dopStyle} className="cs-message-wrap">
            {text !== '|||' ?
            <div dangerouslySetInnerHTML={createMarkup(text)} style={{padding: 10}} className={`cs-message-text left talk-bubble left-top border ${postContinue ? '' : 'tri-right' }`} />
               : null}
            {
              !isNull(props.post.attachments) ?
                props.post.attachments.map(attach => {
                  return (<div style={{padding: 10}} className={`cs-message-text left talk-bubble left-top border ${postContinue ? '' : 'tri-right' }`} key={attach.newName}>
                      <a className="cs-attached" href={`http://chat.medessentially.com${attach.url}`}>{attach.oldName}</a>
                  </div>)
                }) : null
            }
          </div>
        )
      }
    }
  else if (props.userRole !== props.post.author.role && !props.isPopup) {
    return (
      <div style={dopStyle} className="cs-message-wrap">
        {
          text !== '|||' ?
            <div className={`cs-message-text left talk-bubble left-top border ${postContinue ? '' : 'tri-right' }`}>
              {!postContinue ? <span className="assistant-name">{!isAssistant(props.userRole) ? getContentByLocale(window.location.pathname, 'assistant_name') :  props.post.author.name}</span> : null }
              <div dangerouslySetInnerHTML={createMarkup(text)}/>
              <span className="cs-message-time">{moment(props.post.updatedAt).format('DD-MM-YY hh:mm')}</span>
            </div> : null
        }

        {text !== '|||' && !isNull(props.post.attachments) ?
            props.post.attachments.map(attach => {
              return (<div key={attach.newName}><div className={`cs-message-text left talk-bubble left-top border`}><a className="cs-attached" href={`http://chat.medessentially.com${attach.url}`}>{attach.oldName}</a>
                <span className="cs-message-time">{moment(props.post.updatedAt).format('DD-MM-YY hh:mm')}</span></div></div>)
            }) : null
        }
        {text === '|||' && !isNull(props.post.attachments) ?
          props.post.attachments.map((attach, index) => {
            return (<div key={attach.newName}>
              <div className={`cs-message-text left talk-bubble left-top border ${(index === 0 && postContinue) || (index > 0) ? '' : 'tri-right' }`}>
                <a className="cs-attached" href={`http://chat.medessentially.com${attach.url}`}>{attach.oldName}</a>
              <span className="cs-message-time">{moment(props.post.updatedAt).format('DD-MM-YY hh:mm')}</span>
              </div></div>)}) : null
        }
      </div>

    )
  } else {
    return (
      <div style={dopStyle} className="cs-message-wrap right">
        {
          props.post.text !== '|||' ?
            <div className={`cs-message-text right talk-bubble right-top border ${postContinue ? '' : 'tri-right' }`}>
              {/*!postContinue ? <span className="assistant-name">{props.post.author.name}</span> : null */}
              <div dangerouslySetInnerHTML={createMarkup(text)}/>
              <span className="cs-message-time">{moment(props.post.updatedAt).format('DD-MM-YY hh:mm')}</span>
            </div> : null
        }
        {props.post.text !== '|||' && !isNull(props.post.attachments) ?
          props.post.attachments.map(attach => {
            return (<div key={attach.newName}><div className={`cs-message-text right talk-bubble right-top border`}><a className="cs-attached" href={`http://chat.medessentially.com${attach.url}`}>{attach.oldName}</a>
              <span className="cs-message-time">{moment(props.post.updatedAt).format('DD-MM-YY hh:mm')}</span></div></div>)
          }) : null
        }

        {props.post.text === '|||' && !isNull(props.post.attachments) ?
          props.post.attachments.map((attach, index) => {
            return (<div key={attach.newName}>
              <div className={`cs-message-text right talk-bubble right-top border ${(index === 0 && postContinue) || (index > 0) ? '' : 'tri-right' }`}>
                <a className="cs-attached" href={`http://chat.medessentially.com${attach.url}`}>{attach.oldName}</a>
                <span className="cs-message-time">{moment(props.post.updatedAt).format('DD-MM-YY hh:mm')}</span>
              </div></div>)}) : null
        }

      </div>
    );
  }
}
DialogPostsItem.PropTypes = {
  post: PropTypes.object,
  userRole: PropTypes.string.isRequired,
  prevMessageAuthor: PropTypes.string
};


export default DialogPostsItem;


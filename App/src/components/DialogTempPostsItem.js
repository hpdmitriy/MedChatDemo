import React, {PropTypes} from 'react'

const locale = window.location.pathname.split('/');
function DialogTempPostsItem({visible}) {
      if(visible) {
      return(
        <div className="pc-message right">
          <div className="pc-message-item">
            {!!~locale.indexOf('ru') ? 'Как я могу Вам помочь?' : ' Can I help you?'}
          </div>
        </div>
      )
    } else {
        return null
      }
}
DialogTempPostsItem.PropTypes = {
  visible: PropTypes.bool
};


export default DialogTempPostsItem;


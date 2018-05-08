import React, {PureComponent, PropTypes} from 'react';
import {EMOJI_CLASSES} from '../utils/constants'


class Emoji extends PureComponent {
  static propTypes = {
    insertFunc: PropTypes.func,
    visible: PropTypes.bool
  };


  render() {
    const {visible, insertFunc} = this.props
    if (visible) {
      return (
        <div id="EmojiList">
          {Object.keys(EMOJI_CLASSES).map((smile, idx) =>
            <div key={smile} className={EMOJI_CLASSES[smile]}
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   return insertFunc(smile)
                 } }/>
          )}
        </div>
      );
    } else {
      return null
    }
  }
}


export default Emoji;
/*&#x1F601;*/

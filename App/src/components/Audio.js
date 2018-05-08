import React, {PureComponent, PropTypes} from 'react';

export default class Audio extends PureComponent {
  static propTypes = {
    playSound: PropTypes.bool
  }
  static defaultProps = {
    playSound: false
  }

  componentWillReceiveProps(newProps) {
    if(newProps.playSound) {
      this.newMessage.play()
    }
  }
  render() {
    return (
      <div className="stageAudio">
        <audio ref={(newMessage) => {
          this.newMessage = newMessage;
        }}>
          <source src="https://chat.medessentially.com/quite-impressed.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }
}



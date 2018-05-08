import React from 'react'
import { CSSTransition } from 'react-transition-group'



const Fade = ({ children, ...props }) =>{
  return(
  <CSSTransition
    {...props}
    timeout={2000}
    classNames="fade"
  >
    {children}
  </CSSTransition>
)};

export default class PopUpChatButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    setInterval(() => {
      this.setState({ show: !this.state.show })
    }, 2000)
  }
  render() {
    return (
      <Fade in={this.state.show}>
        {this.props.children}
      </Fade>
    )
  }
}

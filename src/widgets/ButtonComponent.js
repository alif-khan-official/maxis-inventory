import React from 'react'
import '../App.css'
class ButtonComponent extends React.Component {
  render() {
    return (
      <div className="buttonComponent">

        <button
          className="btn"
          disabled={this.props.disabled}
          onClick={this.props.onClick}
        >
          {this.props.text}
        </button>
      </div>
    );
  }

}

export default ButtonComponent;
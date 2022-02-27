import React from 'react'
import '../App.css'
class InputFieldComponent extends React.Component {
    render() {
        return (
            <div className="inputField">
                <input
                    className={this.props.className}
                    readOnly={this.props.readOnly}
                    type={this.props.type}
                    pattern={this.props.format}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChange={(e) => this.props.onChange(e.target.value)}
                >
                </input>
            </div>
        );
    }

}

export default InputFieldComponent;
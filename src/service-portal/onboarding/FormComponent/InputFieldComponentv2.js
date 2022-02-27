import React from 'react';
import '../../../App.css';

class InputFieldComponentv2 extends React.Component {
    render() {
        return (
            <div className="inputField">
                {   this.props.readOnly === true?
                    <input
                        className={this.props.className}
                        readOnly
                        type={this.props.type}
                        pattern={this.props.format}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        id={this.props.id}
                        onChange={(e) => this.props.onChange(e.target.value)}
                    >
                    </input>
                :
                    <input
                        className={this.props.className}
                        type={this.props.type}
                        pattern={this.props.format}
                        placeholder={this.props.placeholder}
                        value={this.props.value}
                        id={this.props.id}
                        onChange={(e) => this.props.onChange? this.props.onChange(e.target.value) : {}}
                        onKeyDown={(e) => this.props.onKeyDown? this.props.onKeyDown(e): {} }
                    >
                    </input>
                }
            </div>
        );
    }

}

export default InputFieldComponentv2;
import React from 'react'
import '../../App.css'
class LabelComponent extends React.Component {
    render() {
        return (
            <div className="labelComponent">
                <h5 className={this.props.labelClass}>
                    {this.props.label}
                </h5>
            </div>
        );
    }

}

export default LabelComponent;
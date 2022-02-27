import React from 'react'
import '../../App.css';
class RadioButtonComponent extends React.Component {

    render() {

        return (
            <div className="radio-component">
                <div className="row">
                    <div className="col-sm-0">

                        <input
                            type="radio"
                            value={this.props.value}
                            checked={"checked"}
                            onChange={(e) => this.props.onChange(e.target.value)}
                        />
                    </div>
                    <div className="col-sm-11">
                        <h6>{this.props.label}</h6>
                    </div>
                </div>




            </div>
        );
    }

}

export default RadioButtonComponent;
import React from 'react';
import '../../App.css';
class CheckBoxComponent extends React.Component {
    state = {
        isChecked: false,
    }

    toggleCheckBox() {

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked
            }
        ));
    }

    render() {

        return (
            <div className="checkbox-component">
                <div className="row">
                    <input className="checkbox-input"
                        type="checkbox"
                        value={this.props.value}
                        checked={this.state.isChecked}
                        onChange={(e) => { if (!this.state.isChecked) { this.props.onChange(e.target.value) } else { this.props.onChange("") } this.toggleCheckBox() }}
                    />
                    <div className="checkbox-label">
                        {this.props.label}
                    </div>
                </div>


            </div>
        );
    }

}

export default CheckBoxComponent;
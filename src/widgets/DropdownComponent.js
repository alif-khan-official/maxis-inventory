import React from 'react'
import '../../App.css';
class DropDownComponent extends React.Component {



    render() {

        let dataList = this.props.data;
        let fieldNameOfViewData = this.props.fieldNameOfViewData
        console.log(fieldNameOfViewData);
        return (

            <div className="dropdown">

                <select className="dropdown-select" value={this.value} onChange={(e) => this.props.onChange(e.target.value)}>

                    {dataList.map((item) => <option key={item.id} value={JSON.stringify(item)}>{item.wallet}</option>)}

                </select>

            </div>
        );
    }

}

export default DropDownComponent;
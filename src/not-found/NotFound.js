import React from 'react'
import '../App.css';
import MainComponent from '../common/MainComponent'


class NotFound extends React.Component {

    getComponentDesign() {
        let component = <div>
            <div className="p-d-flex p-jc-center">
                <img alt="" src="/65332127.png" />
            </div>
            <div className="card-body">
                <h1 className="p-d-flex p-jc-center">404</h1>
                <h1 className="p-d-flex p-jc-center">Page Not Found!</h1>
            </div>

        </div>

        return component;
    }
    render() {
        let componentDesign = this.getComponentDesign();

        return <MainComponent component={componentDesign} />;
    }

}

export default NotFound;
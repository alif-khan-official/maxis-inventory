import React from 'react';
import { withRouter } from 'react-router-dom';
import MainComponent from '../../../common/MainComponent';
import GenericListComponent from '../ListComponent/GenericListComponent';
import '../../../App.css';
class UserManagement extends React.Component {

    getComponentDesign() {
        let componentDesign = <div>
            <GenericListComponent
                pageTitle="User Management"
            >
            </GenericListComponent>
        </div>
        return componentDesign;
    }

    render() {

        let componentDesign = this.getComponentDesign()

        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(UserManagement);
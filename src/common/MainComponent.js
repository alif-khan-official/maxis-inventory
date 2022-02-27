import React from 'react';
import '../App.css';
import FooterComponent from './FooterComponent';
import HeaderComponent from './HeaderComponent';
import SideBarComponent from './SideBarComponent';
import AuthUtil from '../auth/AuthUtil.js'
class MainComponent extends React.Component {
    getMainComponentDesign() {
        let design = 
						<div>
				            <HeaderComponent />
							<div className="main">
					            <SideBarComponent />
								<div className="empty32top"></div>
					            <div className="body">
					                {this.props.component}
					            </div>
					
					            <div className="footer">
					                <FooterComponent />
					            </div>
					        </div>
						</div>
        return design;
    }

    getMainComponentDesign2() {
        let design = <div>
            <div className="p-grid p-fluid">
                <div className="p-col-12 p-lg-6">
                    <HeaderComponent />
                </div>
            </div>

            <div className="body">
                NOT LOGGED IN
            </div>

            {/* <div className="row">
                <div className="col-sm-12">
                    <FooterComponent />
                </div>
            </div> */}

        </div>
        return design;
    }

    isforgetPasswordPage() {
        let path = this.props.component._owner.pendingProps.location.pathname;
        if (path === "/submit-otp") {
            return true;
        }

        if (path === "/generate-otp") {
            return true;
        }
        return false;
    }


    render() {

        if (this.isforgetPasswordPage()) {
            return this.getMainComponentDesign();
        }

        if (AuthUtil.isTokenValid()) {
            return this.getMainComponentDesign();
        }
        return this.getMainComponentDesign2();
    }

}

export default MainComponent;
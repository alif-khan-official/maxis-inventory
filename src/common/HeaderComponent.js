import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import AuthUtil from '../auth/AuthUtil'
import '../App.css';
class HeaderComponent extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
        }
    }

    open() {
        if (!this.state.isOpen) {
            document.getElementsByClassName('sidenav')[0]['style'].width = "240px";
            document.getElementsByClassName('main')[0]['style'].marginLeft = "240px";
            this.setState({
                isOpen: true
            });
        } else {
            document.getElementsByClassName('sidenav')[0]['style'].width = "0px";
            document.getElementsByClassName('main')[0]['style'].marginLeft = "0px";
            this.setState({
                isOpen: false
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <div className="p-d-flex topnav">
                <div className="p-d-flex p-jc-start" style={{ marginRight: "auto" }}>
                    {AuthUtil.isTokenValid() && <div className="p-lg-1 p-order-md-1 hamburger" onClick={() => this.open()}>
                        &#9776;
                    </div>}
                    {AuthUtil.isTokenValid() && <div className="p-lg-12 p-order-md-2 panel-header">{AuthUtil.getUserDetails() ? (AuthUtil.getUserDetails().role[0].displayName + "("+AuthUtil.getUserDetails().role[0].name+")") : ""} Panel</div>}
                </div>

                <div className="p-d-flex" style={{ marginLeft: "auto" }}>
                    <div className="navbar-content">
                        <div className="mydiv">
                            {AuthUtil.isTokenValid() &&
                                <Link
                                    to={{
                                        pathname: "/",
                                    }}
                                    onClick={() => AuthUtil.resetTokenDetail()}
                                >
                                    Logout
                                </Link>
                            }
                        </div>
                    </div>

                    <div className="username">
                        <div className="mydiv">
                            {AuthUtil.isTokenValid() &&
                                <Link
                                    to={{

                                    }}
                                >
                                    {AuthUtil.getUserId()}
                                </Link>
                            }
                        </div>
                    </div>

                    <div className="navbar-content">
                        <div className="mydiv">
                            {!AuthUtil.isTokenValid() &&
                                <Link
                                    to={{
                                        pathname: "/",
                                    }}
                                >
                                    Back To Login
                                </Link>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(HeaderComponent);
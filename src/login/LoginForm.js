import React from 'react';
import { withRouter } from 'react-router-dom';
import '../App.css';
import AuthUtil from '../auth/AuthUtil.js';
//import Constant from '../constants/GeneralConstants';
import ButtonComponent from '../widgets/ButtonComponent';
import InputFieldComponent from '../widgets/InputFieldComponent';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            username: '',
            password: '',

            enable: '',
            text: 'LOGIN',
            responseMessage: '',
            loggedIn: false
        }

        this.keyPressEvent = this.keyPressEvent.bind(this);
		this.ppolicy= this.ppolicy.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !nextState.loggedIn;
    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyPressEvent, false);
    }

    keyPressEvent(event) {
        if (this.state.loggedIn === false && event.code === "Enter") {
            this.doLogin();
        }
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            username: '',
            password: ''
        })
    }


    async getUserDetails() {
        const gwUrl = process.env.REACT_APP_ONBOARD_API_GW_HOST;

        try {
            let res = await fetch(gwUrl + "authorization-service/endpoint/user/" + AuthUtil.getUserId(),
                {
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/json",
                        "token": "Bearer " + AuthUtil.getIdToken()
                    }
                }
            );

            let response = await res.json();

            let userDetails = response.result.response[0];

            console.log("====AuthUtils: userDetails====");
            console.log(userDetails);

            AuthUtil.setUserDetails(userDetails);

            console.log("====AuthUtils: userDetails show====");
            console.log(userDetails.taggedMerchantIds[0].merchantId);
            this.getMenu();
        }
        catch (e) {
            this.resetForm();
        }
    }
    
    ppolicy()
    {
	 this.props.history.push("/privacy-policy");
	}
	
    async getMenu() {
        const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

        try {
            let res = await fetch(gwUrl + 'maxisservice-authorization-service/endpoint/api/user/' + AuthUtil.getUserId() + '/menu', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken(),
                    'userid': AuthUtil.getUserId()
                }
            });

            let result = await res.json();


            if (result) {
                if (result === null) {
                    this.props.history.push("/");
                } else {
                    AuthUtil.setMenu(result);
                    this.setState({ loggedIn: true });
                    this.props.history.push("/home");
                }

            }

        } catch (e) {
            this.resetForm();
        }
    }
    async doLogin() {
        this.setState({
            responseMessage: '',
            enable: 'disable',
            text: 'LOGIN . . . . .'
        });

        if (!this.state.username) {
            this.setState({
                responseMessage: "Username is empty"
            });
            this.setState({
                enable: '',
                text: 'LOGIN'
            });
            return
        }

        if (!this.state.password) {
            this.setState({
                responseMessage: "Password is empty",
            });
            this.setState({
                enable: '',
                text: 'LOGIN'
            });
            return
        }

        const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

        try {
            let res = await fetch(gwUrl + 'maxisservice-authentication-service/endpoint/oauth/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });

            let result = await res.json();

            this.setState({
                enable: '',
                text: 'LOGIN'
            });


            if (result.result.authResponse.id_token) {

                AuthUtil.setUserId(this.state.username);
                AuthUtil.setTanentId(result.result.tanentId);
                AuthUtil.setTokenDetail(result.result.authResponse);
                AuthUtil.setRole(result.result.roleList);

                this.getUserDetails();
            } else {
                this.setState({
                    responseMessage: result.result.message
                });
            }
        } catch (e) {
            this.setState({
                responseMessage: "Internal Server Error"
            });

            this.setState({
                enable: '',
                text: 'LOGIN'
            });
        }

    }

    render() {
        return (
            <div className="card-login">
                <div className="p-d-flex p-jc-center">
                    <img alt="Maxis Systems Limited" height="140px" width="140px" src="/65332127.png" />
                </div>
                <div className="p-d-flex p-jc-center" style={{ fontWeight: 'initial', fontSize: "20px" }}>MAXIS SERVICE</div>
                <br></br>
                <br></br>
                <br></br>
                <div className="card-body">

                    <InputFieldComponent
                        className='input'
                        type='text'
                        placeholder='Username'
                        value={this.state.username ? this.state.username : ''}
                        onChange={(val) => { this.setState({ responseMessage: '' }); this.setInputValue('username', val) }}
                    />

                    <br></br>

                    <InputFieldComponent
                        className='input'
                        type='password'
                        placeholder='Password'
                        value={this.state.password ? this.state.password : ''}
                        onChange={(val) => { this.setState({ responseMessage: '' }); this.setInputValue('password', val) }}
                    />

                    <br></br>


                    <ButtonComponent
                        text={this.state.text}
                        disabled={this.state.enable}
                        onClick={() => this.doLogin()}
                    />

                    {(!this.state.responseMessage) && <div style={{ fontSize: "12px", color: "red" }}><br></br></div>}
                    <div className="p-d-flex p-jc-end">
                        {(this.state.responseMessage) &&
                            <div style={{ fontSize: "12px", color: "red" }}>{this.state.responseMessage}</div>}
                    </div>

                    <ButtonComponent
                        text="Privacy Policy"
                        disabled={this.state.enable}
                        onClick={() => this.ppolicy()}
                    />
                </div>

            </div>


        );
    }

}

export default withRouter(LoginForm);
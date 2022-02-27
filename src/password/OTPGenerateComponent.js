import React from 'react';
import { NotificationManager } from 'react-notifications';
import MainComponent from '../../common/MainComponent';
import InputFieldComponent from '../widgets/InputFieldComponent';
import ButtonComponent from '../widgets/ButtonComponent';
import { withRouter } from 'react-router-dom';

import '../../App.css';

class OTPGenerateComponent extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            userId: '',
        }
    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            userId: '',
        })
    }

    async generateOTP() {
        if (!this.state.userId) {
            NotificationManager.warning('FAILURE', 'UserId field is empty');
            return
        }

        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + 'authorization-service/endpoint/generate-otp', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.state.userId,
                })
            });

            let result = await res.json();

            if (result) {
                this.props.history.push({
                    pathname: '/submit-otp',
                    state: { otpValidationId: result.result.otpValidationId }
                });
            } else {
                NotificationManager.warning(result.result.result, result.result.message);
                console.log(result);
            }

        } catch (e) {

            NotificationManager.warning('FAILURE', 'Failed to send SMS');
            this.resetForm();
            console.log(e);
        }

    }

    getComponentDesign() {


        let design = <div className="card-otp">
            <div className="card-body">
                <h3>OTP Request</h3>

                <h6>An OTP will be sent to your mobile through SMS.</h6>
                <h6>Provide your correct username.</h6>
                <InputFieldComponent
                    className='input'
                    type='text'
                    placeholder='Enter your username here'
                    value={this.state.userId ? this.state.userId : ''}
                    onChange={(val) => this.setInputValue('userId', val)}
                />

                <ButtonComponent
                    text='NEXT'
                    onClick={() => this.generateOTP()}
                />

            </div>
        </div>
        return design;
    }

    render() {
        let componentDesign = this.getComponentDesign();
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(OTPGenerateComponent);

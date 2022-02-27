import React from 'react';
import { NotificationManager } from 'react-notifications';
import MainComponent from '../../common/MainComponent'
import InputFieldComponent from '../widgets/InputFieldComponent'
import ButtonComponent from '../widgets/ButtonComponent'
import { withRouter } from 'react-router-dom';
import '../../App.css'
class OTPSubmitComponent extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        let data = this.props.location.state;
        console.log("data:", data);

        if (data === undefined) {
            this.state = {
                otpValidationId: '',
                otpValue: '',
            }
        } else {
            this.state = {
                otpValidationId: data.otpValidationId,
                otpValue: '',
            }
        }

    }

    setInputValue(property, val) {
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            otpValidationId: '',
            otpValue: ''
        })
    }

    async submitOTP() {
        if (!this.state.otpValue) {
            NotificationManager.warning('FAILURE', 'OTP-Value field is empty');
            return
        }

        if (!this.state.otpValidationId) {
            NotificationManager.warning('FAILURE', 'OTP-Validation Id not found');
            return
        }

        const gwUrl = process.env.REACT_APP_API_GW_HOST;
        try {
            let res = await fetch(gwUrl + 'authorization-service/endpoint/submit-otp', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otpValidationId: this.state.otpValidationId,
                    otpValue: this.state.otpValue

                })
            });

            let result = await res.json();

            if (result) {
                console.log(result);
                NotificationManager.warning('SUCCESS', 'Your New Password is sent to your mobile through SMS');
                this.props.history.push("/");
            } else {
                console.log(result);
            }

        } catch (e) {
            NotificationManager.warning('FAILURE', 'Failed to send SMS');
            this.resetForm();
            this.props.history.push("/generate-otp");
            console.log(e);
        }

    }

    getComponentDesign() {

        let design = <div className="card-otp">
            <div className="card-body">
                <h3>Submit OTP</h3>
                <h6>An OTP is sent to your mobile through SMS.</h6>
                <h6>Submit OTP here for new password.</h6>

                <InputFieldComponent
                    className='input'
                    type='number'
                    placeholder='Submit 4 digit otp'
                    value={this.state.otpValue ? this.state.otpValue : ''}
                    onChange={(val) => this.setInputValue('otpValue', val)}
                />

                <ButtonComponent
                    text='NEXT'
                    onClick={() => this.submitOTP()}
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

export default withRouter(OTPSubmitComponent);

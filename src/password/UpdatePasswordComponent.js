import React from 'react';
import MainComponent from '../common/MainComponent';
import InputFieldComponent from '../widgets/InputFieldComponent';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router-dom';
import AuthUtil from '../auth/AuthUtil.js';
import '../App.css'
class UpdatePasswordComponent extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      userId: AuthUtil.getUserId(),
      newPassword: ''
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
      newPassword: ''
    })
  }

  async changePassword() {
    if (!this.state.userId) {
      return
    }

    if (!this.state.newPassword) {
      return
    }


    const gwUrl = process.env.REACT_APP_API_GW_HOST;
    try {
      let res = await fetch(gwUrl + 'authorization-service/endpoint/user/password-update', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'token': 'Bearer ' + AuthUtil.getIdToken()
        },
        body: JSON.stringify({
          userId: this.state.userId,
          newPassword: this.state.newPassword
        })
      });

      let result = await res.json();

      if (result.result.status === "SUCCESS") {
        console.log(result);
        this.props.history.push("/");
      } else {
        console.log(result);
      }

    } catch (e) {

      this.resetForm();
      console.log(e);
    }

  }

  getComponentDesign() {
    let design = <div className="card-otp">
      <div className="card-body">
        <h3>Update Password</h3>
        <label>Username</label>
        <InputFieldComponent
          className='input'
          readOnly={'readOnly'}
          type='text'
          placeholder='Username'
          value={this.state.prevPassword ? this.state.prevPassword : AuthUtil.getUserId()}
          onChange={(val) => this.setInputValue('prevPassword', val)}
        />
        <br></br>
        <label>New Password</label>
        <InputFieldComponent
          className='input'
          type='password'
          placeholder='Enter new password here'
          value={this.state.newPassword ? this.state.newPassword : ''}
          onChange={(val) => this.setInputValue('newPassword', val)}
        />
        <br></br>
        <div className="p-grid p-fluid">
          <div className="p-col-12 p-lg-12">
            <div className="p-jc-md-end"><Button label="Update" onClick={(e) => this.changePassword()} className="p-button-raised" /></div>
          </div>
        </div>


      </div>
    </div>

    return design;
  }

  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }

}

export default withRouter(UpdatePasswordComponent);

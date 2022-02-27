import React from 'react';
import { withRouter } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../App.css';

class FileUploadAndDownload extends React.Component {

    constructor(props) {
        super(props);

        let field = this.props.field;
        let mode = this.props.mode;
        let rootComponent = this.props.rootComponent;

        let selectedFile = {
            "name": field ? field.value : "",
            "code": field ? field.code : ""
        }

        this.state = {
            "field": field,
            "mode": mode,
            "selectedFile": selectedFile,
            "rootComponent": rootComponent
        }

        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }


    onFileChange(event) {
        // let hidden = this.state.field;
        // hidden.value = event.target.files[0].name;
        this.setState({ selectedFile: event.target.files[0] });
    };

    onFileUpload() {

        const formData = new FormData();

        formData.append("file", this.state.selectedFile);

        console.log(this.state);

        let request = new XMLHttpRequest();

        // let headers = {
        //     "Content-Type": "application/json"
        // }

        request.open("POST", "http://localhost:9090/upload");
        //request.setRequestHeader("header", headers);
        request.send(formData);
        this.setState({ selectedFile: this.state.selectedFile });
        request.onload = function () {
            if (request.status !== 200) {
                console.log(request.responseText);
            } else {
                console.log(request.responseText);
            }
        };
    };

    onFileDownload() {

        let fileCode = this.state.selectedFile.code;
        let fileName = this.state.selectedFile.name;

        try {
            fetch("http://localhost:9090/files/" + fileCode, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html',
                },
            })
                .then(response => response.blob())
                .then(blob => URL.createObjectURL(blob))
                .then(url => {
                    let link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
        }
        catch (e) {

        }
    };

    getComponentDesign() {

        let componentDesign = <div>

            <div className="p-grid">
                <div className="p-col-5">
                    <InputText
                        value={this.state.selectedFile ? this.state.selectedFile.name : ''}
                        readOnly={true}
                        type="text" />
                </div>

                {(this.state.mode === "ADD" || this.state.mode === "EDIT") && <div className="p-col-1">
                    <Button
                        label={<label className="custom-file-upload">
                            <input type="file" onChange={this.onFileChange} />
                            Browse
                        </label>}
                        className="p-button-raised p-button-info" />
                </div>}

                {(this.state.mode === "ADD" || this.state.mode === "EDIT") && <div className="p-col-1">
                    <Button
                        key={2}
                        label="Upload"
                        onClick={() => { this.onFileUpload() }}
                        className="p-button-raised p-button-info" />
                </div>}

                {(this.state.mode === "VIEW" || this.state.mode === "EDIT") && <div className="p-col-1">
                    <Button
                        key={1}
                        label="Download"
                        onClick={() => { this.onFileDownload() }}
                        className="p-button-raised p-button-info" />
                </div>}

                <div className="p-col-5">
                    <InputText
                        value={this.state.hidden ? this.state.hidden : ''}
                        readOnly={true}
                        hidden={true}
                        type="text" />
                </div>
            </div>

        </div>

        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign()
        return componentDesign;
    }
}
export default withRouter(FileUploadAndDownload);
import React from 'react';
import { withRouter } from 'react-router-dom';
import MainComponent from '../common/MainComponent';
import FileUploadAndDownload from './FileUploadAndDownload';
import '../App.css';
class FrontendLab extends React.Component {


    getField1() {
        let field = {
            "id": "1",
            "key": "NID_FRONT",
            "code": "60d952fd23d9214e81c40eac",
            "value": "mukitul_islam_aust.pdf"
        }
        return field;
    }

    getField2() {
        let field = {
            "id": "2",
            "key": "NID_FRONT",
            "Code": "",
            "value": ""
        }
        return field;
    }

    getComponentDesign() {
        // do your experiments here!
        let componentDesign = <div>
            <FileUploadAndDownload
                field={this.getField1()}
                mode="VIEW"
                rootComponent={this}
            >
            </FileUploadAndDownload>

            <FileUploadAndDownload
                field={this.getField2()}
                mode="ADD"
                rootComponent={this}
            >
            </FileUploadAndDownload>

            <FileUploadAndDownload
                field={this.getField1()}
                mode="EDIT"
                rootComponent={this}
            >
            </FileUploadAndDownload>
        </div>
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign()
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(FrontendLab);
import React, { Component } from "react";
import * as API from "../api/API";
import FileGridList from "./FileGridList";
import { connect } from "react-redux";
import {
  addFile,
  deleteFile,
  afterlogin,
  getFiles,
  sharedCount,
} from "../actions/index";
import RightNavBar from "./RightNavBar";
import LeftNavBar from "./LeftNavBar";
import Header from "./Header";
import { withRouter } from "react-router-dom";

class FileUpload extends Component {
  state = {
    message: "",
    fileparent: "",
  };

  componentWillMount() {
    API.getUserDetails().then((userres) => {
      if (userres.status === 200) {
        userres.json().then((userdata) => {
          localStorage.setItem("email", userdata.email);
          this.props.afterlogin(userdata);
        });

        API.getFilesForUser().then((fileres) => {
          if (fileres.status === 200) {
            fileres.json().then((files) => {
              this.props.getFiles(files);
            });
          } else if (fileres.status === 401) {
            this.props.history.push("/");
          }
        });
      } else {
        this.props.history.push("/");
      }
    });
  }

  handleFileUpload = (event) => {
    const payload = new FormData();
    payload.append("file", event.target.files[0]);
    payload.append("fileparent", this.state.fileparent);

    API.uploadFile(payload).then((res) => {
      if (res.status === 200) {
        res.json().then((filedata) => {
          this.props.addFile(filedata);
        });
        this.setState({ message: "File uploaded successfully" });
      } else {
        this.setState({ message: "File error" });
      }
    });
  };

  render() {
    return (
      <div>
        <Header />

        {this.state.message && (
          <div style={{ color: "red", textAlign: "center", margin: "10px 0" }}>
            {this.state.message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            margin: "10px 0",
          }}
        >
          <input
            accept="*"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={this.handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            style={{
              cursor: "pointer",
              background: "#1976d2",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "10px" }}>Upload File</span>
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <a
            href="#"
            onClick={() => this.navigateHome()}
            style={{
              textDecoration: "none",
              cursor: "pointer",
              fontSize: "24px",
              color: "#1976d2",
            }}
          >
            My Dropbox
          </a>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <LeftNavBar />
          <FileGridList
            deleteFile={this.deleteFile}
            sharefileingroup={this.sharefileingroup}
            sharefile={this.sharefile}
            openFileFolder={this.openFileFolder}
            parentFile={this.state.fileparent}
          />
          <RightNavBar
            makeFolder={this.makeFolder}
            makeSharedFolder={this.makeSharedFolder}
            parentFile={this.state.fileparent}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(reducerdata) {
  return { filesdata: reducerdata.filesreducer };
}

function mapDispatchToProps(dispatch) {
  return {
    addFile: (data) => dispatch(addFile(data)),
    deleteFile: (index) => dispatch(deleteFile(index)),
    afterlogin: (data) => dispatch(afterlogin(data)),
    getFiles: (data) => dispatch(getFiles(data)),
    sharedCount: (index, data) => dispatch(sharedCount(index, data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);

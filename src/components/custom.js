import { Button, Spin, Upload } from 'antd'
import React from 'react'
import './../../node_modules/antd/dist/reset.css'
import { InboxOutlined } from '@ant-design/icons';


function CustomUpload() {
  return (
    <div style={{
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        height : "100vh"
    }}>
        <Upload.Dragger 
        listType='file'
        accept='.xlsx'
        action={"http://localhost:3000/"}
        beforeUpload={(file) => {
            console.log({file})
            return false
        }}
        showUploadList={{ showRemoveIcon :true }}
        defaultFileList={[
            {
                uid : "Abc",
                name : "exiting file.xlsx",
                percent : 50,
                url : "https://www.google.com/"
            }
        ]}
        iconRender={(file) => {
            if (file == file){
            return <Spin></Spin>
            }
        }}
        progress={{
            strokeWidth : 3,
            strokeColor : {
                "0%" : "#f0f",
                "100%" : "#ff0"
            }
        }}
        >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <br />
            <Button>Upload</Button>
        </Upload.Dragger>
    </div>
  )
}

export default CustomUpload
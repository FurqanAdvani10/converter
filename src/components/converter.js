import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { read, utils } from 'xlsx';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { saveAs } from 'file-saver';
import './converter.css';

const Converter = () => {

    const { Dragger } = Upload;
    const [sifData, setSifData] = useState('');
    const [data, setData] = useState('')
    const [fileList, setFileList] = useState([]);


    const convretMonthYearToDayMonthYear = (val) => {
        // Parse the date string "val" to a Date object
        const dateString = val;
        // console.log(dateString, "sdjfhsjk")
        // const year = new Date().getFullYear(); // Assuming current year
        const date = new Date(`${dateString}`);

        // Set the day to "01"
        date.setDate(1);

        return date
    }

    const getStartAndEndDayWithTotalDays = (val) => {

        const date = convretMonthYearToDayMonthYear(val);
        const monthStartDate = startOfMonth(date);
        const monthEndDate = endOfMonth(date);
        const formattedStartDate = format(monthStartDate, 'yyyy-MM-dd');
        const formattedEndDate = format(monthEndDate, 'yyyy-MM-dd');
        const totalDaysInMonth = monthEndDate.getDate();

        return {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            totalDaysInMonth
        }
    }

    function convertData(records) {
        const convertedRecords = records.map(record => {
            const personalNo = record["Personal No"];
            const routingCode = record["Routing Code"];
            const accountNo = record["AccountNo/IBAN"];
            const fixedAmount = record["Fixed Amount"];
            const variableAmount = record["Variable Amount"];
            const leaveDays = record["Leave Days"];
            const remarks = record["Remarks"];
    
            // Extract month and year from remarks
            const [monthStr, yearStr] = remarks.split(" ");
            const month = new Date(Date.parse(monthStr + " 1, 2000")).getMonth();
            const year = parseInt(yearStr, 10) + 2000;
    
            // Calculate startDate, endDate, and totalDaysInMonth
            const date = new Date(year, month, 1);
            const startDate = startOfMonth(date);
            const endDate = endOfMonth(date);
            const formattedStartDate = format(startDate, 'yyyy-MM-dd');
            const formattedEndDate = format(endDate, 'yyyy-MM-dd');
            const totalDaysInMonth = endDate.getDate();
    
            // Constructing the EDR record
            const edrRecord = `EDR,${personalNo},${routingCode},${accountNo},${formattedStartDate},${formattedEndDate},${totalDaysInMonth},${fixedAmount},${variableAmount},${leaveDays}\n`;
            console.log('edrRecord', edrRecord);
            return edrRecord;
        });
    
        const fileContent = convertedRecords.join('');
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'convertedData.txt');
    }

    const handleFileUpload = (file) => {
        // const { file } = data;
        console.log(file, "info")

        const reader = new FileReader();

        reader.onload = (e) => {


            const data = new Uint8Array(e.target.result);
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(sheet);
            console.log(jsonData, "jspn")
            setSifData(convertData(jsonData));


        };

        reader.readAsArrayBuffer(file.originFileObj);
    };

    const props = {
        name: 'file',
        multiple: false,
        accept: ".xlsx",
        beforeUpload: file => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            if (!isExcel) {
                message.error(`${file.name} is not a .xlsx file`);
            }
            return isExcel || Upload.LIST_IGNORE;
        },
        onChange(info) {

            setTimeout(() => {
                const newFileList = info?.fileList?.map(file => {
                    if (file.uid === info.file.uid) {
                        handleFileUpload(file); // Call handleFileUpload here after the status is set to 'done'
                        return { ...file, status: 'done' };
                    }
                    return file;
                });
                message.success(`${info.file.name} file uploaded successfully.`);
                setFileList(newFileList);
            }, 2000);
        },
        fileList,
    };



    return (
        <>
            <div className='converter-main'>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Strictly prohibited from uploading company data or other banned files.
                    </p>
                </Dragger>

            </div>
            {/* <div>
                <h2>SIF Data</h2>
                <p>{sifData}</p>
            </div> */}
        </>

    );
};

export default Converter;

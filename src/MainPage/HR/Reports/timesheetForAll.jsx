import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { PDFViewer, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import useHttp from "../../../hooks/useHttp";
import dayjs from "dayjs";
import moment from "moment";
import logo from "../../../assets/img/logo.png";


function formatDuration(duration) {
    if (duration) {
        const durationInMilliseconds = duration / 10000; // Convert ticks to milliseconds

        const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        return `${hours} Hrs`;
    }

    return "0 Hrs"; // Return an empty string if duration is not available
}

const todayDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const today = new Date();
const formattedTodayDate = todayDate(today);

const styles = StyleSheet.create({
    table: {
        display: "table",
        width: "auto",
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row",

    },
    tableCol: {
        width: "55px",
        borderWidth: 0,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#DEE2E6"
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
        padding: "1%",
    },
    page: {
        flexDirection: "row",
        padding: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
});


const TimesheetPDF = ({ total, timesheet }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Image src={logo} style={styles.logo} />
                        <Text style={{ textAlign: "center", fontSize: 10, marginBottom: 10 }}>Staff Attendance Sheet from {moment(total.fromDate).format('LLL')} to {moment(total.toDate).format('LLL')}</Text>
                    </View>
                    <View style={styles.table}>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Staff Name</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Normal Shift Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Evening Shift Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Saturday Shift Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Sunday Shift Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Exceptional Shift Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Public Holiday</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Night Shift</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Total Km</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Total Duration</Text>
                            </View>
                        </View>





                        {timesheet.map((data, index) => (
                            <View style={styles.tableRow} key={index}>

                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{data.staffName}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.normalDuration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.eveningDuration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.satDuration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.sunDuration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.exceptionalDuration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.phDuration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{data.nightShift}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{(data.totalKm).toFixed(3)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.totalDuration)}</Text>
                                </View>


                            </View>


                        ))}






                    </View>





                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30 }}>
                        <View style={{ flexDirection: "column", alignItems: "center", gap: 5 }}>
                            <View style={{ border: "1 solid black", marginBottom: 10, width: "150px" }}></View>
                            <Text style={{ fontSize: 10 }}>Approved By</Text>
                        </View>
                        <View style={{ flexDirection: "column", alignItems: "center", gap: 5 }}>
                            <View style={{ border: "1 solid black", marginBottom: 10, width: "150px" }}></View>
                            <Text style={{ fontSize: 10 }}>Payroll Officer and Date</Text>
                        </View>
                    </View>



                </View>
            </Page>
        </Document>
    );
};

const TimesheetForAll = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const { dateFrom, dateTo } = useParams();
    const { get } = useHttp();
    const [timesheet, setTimesheet] = useState([]);
    const [total, setTotal] = useState({});

    const GetTimeshift = async (e) => {
        try {
            const { data } = await get(`/Attendances/generate_all_staff_timesheet?userId=${id.userId}&fromDate=${dateFrom}&toDate=${dateTo}`, { cacheTimeout: 300000 });
            setTimesheet(data?.timesheet?.staffTimeSheet);
            setTotal(data?.timesheet)
            if (data.status === "Success") {
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetTimeshift();
    }, []);





    return (
        <>
            <Helmet>
                <title>Timesheet For All Staff</title>
            </Helmet>

            <PDFViewer width="100%" height={800}>
                <TimesheetPDF total={total} timesheet={timesheet} />
            </PDFViewer>
        </>
    );
};

export default TimesheetForAll;

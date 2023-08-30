import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { PDFViewer, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import useHttp from "../../../hooks/useHttp";
import dayjs from "dayjs";
import moment from "moment";
import logo from "../../../assets/img/logo.png";
import axiosInstance from "../../../store/axiosInstance";

const formatDate = (dateString) => {
    const date = dayjs(dateString);

    // Format 1: Monday
    const formattedDay = date.format('dddd');
    // Format 1: 06/15/2023
    const formattedDate = date.format('MM/DD/YYYY');

    // Format 2: 08:40 PM
    const formattedTime = date.format('hh:mm A');

    return { formattedDay, formattedDate, formattedTime };
};

function formatDuration(duration) {
    if (duration) {
        const durationInMilliseconds = duration / 10000; // Convert ticks to milliseconds

        const durationInMinutes = Math.floor(durationInMilliseconds / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;

        return `${hours} Hrs ${minutes} min`;
    }

    return "0 Hrs 0 min"; // Return an empty string if duration is not available
}

// function formatDuration(duration) {
//     if (duration) {
//         const durationInTicks = BigInt(duration);
//     const durationInMilliseconds = Number(durationInTicks) / 10000; // Convert ticks to milliseconds

//     const durationInMinutes = Math.ceil(durationInMilliseconds / (1000 * 60)); // Round up minutes
//     const totalHours = Math.floor(durationInMinutes / 60);
//     const totalMinutes = durationInMinutes % 60; // Get remaining minutes

//     // Add remaining minutes to total hours if totalMinutes >= 30
//     const finalHours = totalHours + Math.floor(totalMinutes / 30);

//     return `${finalHours} Hrs`;
//     }
//     return "0 Hrs 0 min";
// }

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
        width: "100px",
        borderWidth: 0,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#DEE2E6"
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
        padding: "2%",
    },
    page: {
        padding: 20,
    },
    logo: {
        width: 80,
        height: 50,
        marginBottom: 10,
    },
});



const TimesheetPDF = ({ total, timesheet }) => {

    const [companyOne, setCompanyOne] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const FetchCompany = async () => {
    try {
        const { data } = await axiosInstance.get(`/Companies/get_company/${user.companyId}`, { cacheTimeout: 300000 })
        // console.log(data);
        setCompanyOne(data.company)

    } catch (error) {
        console.log(error);
    }
}
useEffect(() => {
    FetchCompany()
}, []);

    return (
        <Document>
            <Page style={styles.page} orientation="landscape">
                <View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Image src={ companyOne.companyLogo ? companyOne.companyLogo : logo } style={styles.logo} />
                        <Text style={{ textAlign: "center", fontSize: 10, marginBottom: 10 }}>{total.staffName} Attendance Sheet from {moment(total.fromDate).format('LLL')} to {moment(total.toDate).format('LLL')}</Text>
                    </View>
                    <View style={styles.table}>

                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Date</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Day</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Clock In</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Clock Out</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Duration</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Km</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Client</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Shift</Text>
                            </View>
                        </View>





                        {timesheet.map((data, index) => (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDate(data.clockIn).formattedDate}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDate(data.clockIn).formattedDay} </Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDate(data.clockIn).formattedTime}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDate(data.clockOut).formattedTime}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{formatDuration(data.duration)}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{data.totalKm}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={styles.tableCell}>{data.shiftRoster?.profile?.fullName}</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <View style={{ padding: 3 }}>
                                        <Text
                                            style={{
                                                borderRadius: 3,
                                                padding: 1,
                                                backgroundColor: data.shift === 'M' ? '#198754' : data.shift === 'E' ? '#0dcaf0' : data.shift === 'N' ? '#adb5bd' : data.shift === "SU" ? '#e44786' : '#1C75BC',
                                                color: "white",
                                                fontSize: 10,
                                                textAlign: "center",
                                            }}
                                        >
                                            {data.shift === 'M' ? 'Normal' : data.shift === 'E' ? 'Evening' : data.shift === "SU" ? 'Sunday'
                                                : data.shift === "PH" ? 'Public Holiday' : data.shift === "SUN" ? 'Sunday Night' : data.shift === "SAN" ? 'Saturday Night' :
                                                    data.shift === "EX" ? 'Active Night' : data.shift === "N" ? 'Sleepover' : data.shift === "SA" ? 'Saturday' : ""
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>


                        ))}



                        <View style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}></Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>Total</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}></Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}></Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{formatDuration(total.totalDuration)}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{total.totalKm}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}></Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}></Text>
                            </View>
                        </View>


                    </View>



                    <View style={{ flexDirection: "column", marginTop: 20, gap: 2 }}>
                        <Text style={{ fontSize: 10 }}>Total Duration for Normal Shift: {formatDuration(total.normalDuration)}</Text>
                        <Text style={{ fontSize: 10 }}>Total Duration for Evening Shift: {formatDuration(total.eveningDuration)}</Text>
                        <Text style={{ fontSize: 10 }}>Total Duration for Active Night Shift: {formatDuration(total.exceptionalDuration)}</Text>
                        <Text style={{ fontSize: 10 }}>Total Duration for Saturday Shift: {formatDuration(total.satDuration)}</Text>
                        <Text style={{ fontSize: 10 }}>Total Duration for Sunday Shift: {formatDuration(total.sunDuration)}</Text>
                        <Text style={{ fontSize: 10 }}>Total Duration for Public Holidays Shift: {formatDuration(total.phDuration)}</Text>
                        <Text style={{ fontSize: 10 }}>Total Sleepover Shift: {total.nightShift}</Text>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30 }}>
                        <View style={{ flexDirection: "column", alignItems: "center", gap: 5 }}>
                            <Text style={{ fontWeight: "ultrabold", textTransform: "uppercase", fontSize: 10 }}>{total.staffName}</Text>
                            <Text style={{ fontSize: 10 }}>NAME OF STAFF</Text>
                        </View>
                        <View style={{ flexDirection: "column", alignItems: "center", gap: 5 }}>
                            <Text style={{ fontSize: 10 }}>{formattedTodayDate}</Text>
                            <Text style={{ fontSize: 10 }}>Date</Text>
                        </View>
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

const Timesheet = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    const { sta, dateFrom, dateTo } = useParams();
    const { get } = useHttp();
    const [timesheet, setTimesheet] = useState([]);
    const [total, setTotal] = useState({});

    const [companyOne, setCompanyOne] = useState({});

//   const FetchCompany = async () => {
//     try {
//         const { data } = await axiosInstance.get(`/Companies/get_company/${id.companyId}`, { cacheTimeout: 300000 })
//         // console.log(data);
//         setCompanyOne(data.company)
//         // console.log(data.company);
//         // setEditedCompany({ ...data.company })


//     } catch (error) {
//         console.log(error);
//     }
// }
// useEffect(() => {
//     FetchCompany()
// }, []);

    const GetTimeshift = async (e) => {
        try {
            const { data } = await get(`/Attendances/generate_staff_timesheet?userId=${id.userId}&staffid=${sta}&fromDate=${dateFrom}&toDate=${dateTo}`, { cacheTimeout: 300000 });
            setTimesheet(data?.timesheet?.attendanceSplits);
            setTotal(data?.timesheet)
            console.log(data);
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
                <title>Timesheet</title>
            </Helmet>

            <PDFViewer width="100%" height={800}>
                <TimesheetPDF total={total} timesheet={timesheet} />
            </PDFViewer>
        </>
    );
};

export default Timesheet;

import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import moment from "moment";
import logo from "../../../assets/img/logo.png";
import useHttp from "../../../hooks/useHttp";
import { useParams } from 'react-router-dom';
import axiosInstance from "../../../store/axiosInstance";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        padding: 20,
    },
    logo: {
        width: 70,
        height: 50,
        marginBottom: 10,

    },
    title: {
        textAlign: "center",
        fontSize: 14,
        marginBottom: 10,
    },
    subtitle: {
        textAlign: "center",
        fontSize: 10,
        marginBottom: 10,
    },
    content: {
        marginBottom: 20,
    },
});

const Report = ({ details }) => {

    const [companyOne, setCompanyOne] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));
  
    const FetchCompany = async () => {
      try {
        const { data } = await axiosInstance.get(`/Companies/get_company/${user.companyId}`, { cacheTimeout: 300000 })
        // console.log(data.company);
        setCompanyOne(data.company)
        // console.log(data.company);
        // setEditedCompany({ ...data.company })
  
  
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      FetchCompany()
    }, []);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Image src={companyOne.companyLogo ? companyOne.companyLogo : logo} style={styles.logo} />
                        <Text style={styles.title}>Staff Progress Report</Text>
                        <Text style={styles.subtitle}>
                            Progress Note Details by {details.staff}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <View style={{ flexDirection: "column", gap: 2 }}>


                            <View style={{ flexDirection: "column", gap: 2 }}>

                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Report</Text>
                                <Text style={{ fontSize: 10 }}>{details.report}</Text>
                            </View>


                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={{ flexDirection: "column", gap: 2 }}>


                            <View style={{ flexDirection: "column", gap: 2 }}>

                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Progress</Text>
                                <Text style={{ fontSize: 10 }}>{details.progress}</Text>
                            </View>


                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={{ flexDirection: "column", gap: 2 }}>


                            <View style={{ flexDirection: "column", gap: 2 }}>

                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>Follow Up</Text>
                                <Text style={{ fontSize: 10 }}>{details.followUp}</Text>
                            </View>


                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const StaffProgress = () => {
    const { uid } = useParams();
    const [details, setDetails] = useState({});

    const { get } = useHttp();

    const fetchProgress = async () => {

        try {
            const { data } = await get(`/ProgressNotes/${uid}`, { cacheTimeout: 300000 });
            setDetails(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, [uid]); // Include uid as a dependency




    return (
        <>
            <PDFViewer width="100%" height={800}>
                <Report details={details} />
            </PDFViewer>
        </>
    );
};

export default StaffProgress;

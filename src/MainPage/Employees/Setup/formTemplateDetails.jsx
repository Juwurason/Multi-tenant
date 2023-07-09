import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, Image, StyleSheet, PDFViewer, } from "@react-pdf/renderer";
import logo from "../../../assets/img/logo.png";
import useHttp from "../../../hooks/useHttp";
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';


const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        padding: 20,
    },
    logo: {
        width: 50,
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

const Template = ({ details }) => {
    const parsedContent = parse(details.content);


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Image src={logo} style={styles.logo} />
                        <Text style={styles.title}>Form Template</Text>
                        <Text style={styles.subtitle}>
                            {details.templateName}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <PdfText>{details.content}</PdfText>
                    </View>


                </View>
            </Page>
        </Document>
    );
};

const formTemplateDetails = () => {
    const { uid } = useParams();
    const [details, setDetails] = useState({});

    const { get } = useHttp();

    const fetchDetails = async () => {

        try {
            const { data } = await get(`/Templates/template_details/${uid}`, { cacheTimeout: 300000 });
            console.log(data);
            setDetails(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [uid]); // Include uid as a dependency




    return (
        <>
            <PDFViewer width="100%" height={800}>
                <Template details={details} />
            </PDFViewer>
        </>
    );
};

export default formTemplateDetails;

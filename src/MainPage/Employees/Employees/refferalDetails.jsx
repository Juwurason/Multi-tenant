// import React, { useState, useEffect } from "react";
// import useHttp from "../../../hooks/useHttp";
// import { useParams } from 'react-router-dom';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import logo from "../../../assets/img/logo.png";

// const FormTemplateDetails = () => {
//     const { uid } = useParams();
//     const [details, setDetails] = useState({});
//     const [isLoading, setIsLoading] = useState(true);

//     const { get } = useHttp();

//     const fetchDetails = async () => {
//         try {
//             const { data } = await get(`/Templates/template_details/${uid}`, { cacheTimeout: 300000 });
//             console.log(data);
//             setDetails(data);
//             setIsLoading(false);
//         } catch (error) {
//             console.log(error);
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchDetails();
//     }, [uid]);

//     const generatePdf = async () => {
//         const content = document.getElementById("pdf-content");
//         if (!content) {
//             return;
//         }

//         const pdf = new jsPDF("p", "mm", "a4");
//         let pageHeight = pdf.internal.pageSize.getHeight();

//         const elements = content.children;
//         let yOffset = 0;

//         for (let i = 0; i < elements.length; i++) {
//             const element = elements[i];
//             const canvas = await html2canvas(element);

//             const imgData = canvas.toDataURL("image/png");
//             pdf.addImage(imgData, "PNG", 0, yOffset, pdf.internal.pageSize.getWidth(), 0);
            
//             yOffset += (canvas.height * pdf.internal.pageSize.getWidth()) / canvas.width;

//             if (yOffset >= pageHeight) {
//                 pdf.addPage();
//                 yOffset = 0;
//             }
//         }

//         pdf.save("document.pdf");
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="d-flex flex-column align-items-center justify-content-center">
//             <div>
//                 <img src={logo} alt="" />
//             </div>
//             <div
//                 id="pdf-content"
//                 dangerouslySetInnerHTML={{ __html: details.content }}
//                 style={{
//                     padding: '20px',
//                     fontFamily: 'Arial, sans-serif',
//                     fontSize: '14px',
//                     lineHeight: '1.6',
//                     color: '#333',
//                     // backgroundColor: '#f8f8f8',
//                 }}
//                 className="shadow-sm"
//             />
//             <div>
//                 {/* <button className="btn btn-primary add-btn rounded" onClick={generatePdf}>
//                     Generate PDF
//                 </button> */}
//             </div>
//         </div>
//     );
    
// };

// export default FormTemplateDetails;

// import React, { useState, useEffect } from "react";
// import { Document, Page, Text, View, Image, StyleSheet, PDFViewer, } from "@react-pdf/renderer";
// import logo from "../../../assets/img/logo.png";
// import useHttp from "../../../hooks/useHttp";
// import { useParams } from 'react-router-dom';
// import parse from 'html-react-parser';

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: "column",
//         padding: 20,
//     },
//     logo: {
//         width: 50,
//         height: 50,
//         marginBottom: 10,
//     },
//     title: {
//         textAlign: "center",
//         fontSize: 14,
//         marginBottom: 10,
//     },
//     subtitle: {
//         textAlign: "center",
//         fontSize: 10,
//         marginBottom: 10,
//     },
//     content: {
//         marginBottom: 20,
//     },
// });

// const removeHtmlTags = (html) => {
//     const cleanText = html.replace(/<\/?[^>]+(>|$)/g, "");
//     return cleanText;
// };

// const Template = ({ details }) => {
//     const parsedContent = details.content ? parse(removeHtmlTags(details.content.replace(/\\"/g, '"'))) : null;
//     // console.log(parsedContent);
//     return (
//         <Document>
//             <Page size="A4" style={styles.page}>
//                 <View>
//                     <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
//                         <Image src={logo} style={styles.logo} />
//                         <Text style={styles.title}>Form Template</Text>
//                         <Text style={styles.subtitle}>
//                             {details.templateName}
//                         </Text>
//                     </View>

//                     <View style={styles.content}>
//                         {parsedContent}
//                     </View>
//                 </View>
//             </Page>
//         </Document>
//     );
// };

// const RefferalDetails = () => {
//     const { uid } = useParams();
//     const [details, setDetails] = useState({});
//     const [isLoading, setIsLoading] = useState(true);

//     const { get } = useHttp();

//     const fetchDetails = async () => {
//         try {
//             const { data } = await get(`/Templates/template_details/${uid}`, { cacheTimeout: 300000 });
//             console.log(data);
//             setDetails(data);
//             setIsLoading(false);
//         } catch (error) {
//             console.log(error);
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchDetails();
//     }, [uid]);

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <PDFViewer width="100%" height={800}>
//             <Template details={details} />
//         </PDFViewer>
//     );
// };

// export default RefferalDetails;

import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import useHttp from "../../../hooks/useHttp";
import logo from "../../../assets/img/logo.png";
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';
import { FaBlackTie } from "react-icons/fa";

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
    fontSize: 16,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 10,
  },
  content: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 1.5,
  },
  tableCell: {
    padding: 5,
    border: "1px solid black",
    flex: 1,
    fontWeight: "normal", // Make the data less bold
    fontSize: 10, // Make the data smaller
  },
  tableCellHeader: {
    color: "#000",
    // marginBottom: 1, // Separate header from table
    fontWeight: "bold",
    fontSize: 12, // Make the header slightly larger
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 20,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderCollapse: "collapse"
  },
  tableRow: {
    flexDirection: "row",
  },
});

const RefferalDetails = () => {
  const { uid } = useParams();
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { get } = useHttp();

  const fetchDetails = async () => {
    try {
      const { data } = await get(`/ClientReferrals/get_client_referral_details/${uid}`, { cacheTimeout: 300000 });
      console.log(data);
      setDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [uid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
 

  return (
    <PDFViewer width="100%" height={800}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Image src={logo} style={styles.logo} />
              <Text style={styles.title}>Form Template</Text>
            </View>

            {/* Move the tableCellHeader outside of the table */}
            <Text style={styles.tableCellHeader}>Personal Details</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Name:</Text>
                <Text style={styles.tableCell}>{details.fullName}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Email:</Text>
                <Text style={styles.tableCell}>{details.email}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Current Residence:</Text>
                <Text style={styles.tableCell}>{details.currentResidence}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Contact Number:</Text>
                <Text style={styles.tableCell}>{details.contactNumber}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Date of Birth:</Text>
                <Text style={styles.tableCell}>{details.dob}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Gender: </Text>
                <Text style={styles.tableCell}>{details.gender}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they identify as Aboriginal or Torres Strait Islander?: </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they identify as Culturally and LinguisticallyDiverse(CALD)? </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NOK/ EmergencyContact Details: </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they havea nominated carer?If yes, please providecontact details </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
            </View>


            <Text style={styles.tableCellHeader}>NDIS PLAN DETAILS</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NDIS Number:</Text>
                <Text style={styles.tableCell}>{details.ndisNo}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>PlanManager Details:</Text>
                <Text style={styles.tableCell}>{details.email}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NDIS Start Date</Text>
                <Text style={styles.tableCell}>{details.ndisStartDate}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NDIS End Date:</Text>
                <Text style={styles.tableCell}>{details.ndisEndDate}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NDIS Goals</Text>
                <Text style={styles.tableCell}>{details.ndisGoals}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>What lineitemfromtheir NDIS plan should MaxiCare Plus useto providesupport? </Text>
                <Text style={styles.tableCell}>{details.gender}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they identify as Aboriginal or Torres Strait Islander?: </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they identify as Culturally and LinguisticallyDiverse(CALD)? </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NOK/ EmergencyContact Details: </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they havea nominated carer?If yes, please providecontact details </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default RefferalDetails;


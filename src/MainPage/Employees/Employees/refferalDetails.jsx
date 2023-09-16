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
    fontSize: 12,
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
    // border: "1px solid grey",
    flex: 1,
    fontWeight: "normal", // Make the data less bold
    fontSize: 10, // Make the data smaller
    borderLeftColor: "grey",
    borderLeftWidth: 1,
    borderTopColor: "grey",
    borderTopWidth: 1,
  },
  tableCellHeader: {
    color: "#000",
    // marginBottom: -10, // Separate header from table
    fontWeight: "normal",
    fontSize: 10, // Make the header slightly larger
  },
  table: {
    display: "table",
    width: "100%",
    // marginTop: 5,
    marginBottom: 15,
    // borderStyle: "solid",
    // borderColor: "grey",
    // borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
});

const RefferalDetails = () => {
  const { uid } = useParams();
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [companyOne, setCompanyOne] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  const { get } = useHttp();

  const fetchDetails = async () => {
    try {
      const { data } = await get(`/ClientReferrals/get_client_referral_details/${uid}`, { cacheTimeout: 300000 });
      // console.log(data);
      setDetails(data);
      setIsLoading(false);

      
    }
     catch (error) {
      console.log(error);
      setIsLoading(false);
    }

    try {
      const { data } = await axiosInstance.get(`/Companies/get_company/${user.companyId}`, { cacheTimeout: 300000 })
      // console.log(data.company);
      setCompanyOne(data.company)
    } catch (error) {
      console.log(error);
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
              <Image src={companyOne.companyLogo ? companyOne.companyLogo : logo} style={styles.logo} />
              <Text style={styles.title}>Referral Document of {details.name}</Text>
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
                <Text style={styles.tableCell}>{details.aboriginal_Torres}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they identify as Culturally and LinguisticallyDiverse(CALD)? </Text>
                <Text style={styles.tableCell}>{details.culturally_Linguistically}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>NOK/ EmergencyContact Details: </Text>
                <Text style={styles.tableCell}>{details.emergency_Contact}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they havea nominated carer?If yes, please providecontact details </Text>
                <Text style={styles.tableCell}>{details.nominatedCarer}</Text>
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
                <Text style={styles.tableCell}>{details.planManager}</Text>
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
                <Text style={styles.tableCell}>{details.lineItem}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}><Text style={{ fontWeight: "heavy" }}> Provider Travel </Text> 
The NDIA grants a travelallowance of up to 30 minutes to service providers when providing supports. Maxi Care Plus willclaim a
maximum of 30 minutes when the support worker travels from one participant to another in addition to the scheduled supports i.e., 30
minutes is added to the 2 hours of scheduled supports, which will be claimed as 2.5 support hours. Alternatively, the participant may
request that travelallowance is deducted from the first hours of service for all shifts scheduled where a support worker has travelled
from another participant i.e., deliver 90 minutes of service for a 2 hour shift but claim or invoice for the full 2 hours or total period. </Text>
                {/* <Text style={styles.tableCell}>{details.gender}</Text> */}
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Where is the provider traveltimeto beclaimed form? </Text>
                <Text style={styles.tableCell}>{details.providerTravel}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Can MaxiCare Plus TTP rate? </Text>
                <Text style={styles.tableCell}>{details.ttpRate}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do you require a quote? </Text>
                <Text style={styles.tableCell}>{details.quote}</Text>
              </View>
            </View>


            <Text style={styles.tableCellHeader}>MEDICAL DETAILS</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Psychiatric Diagnosis:</Text>
                <Text style={styles.tableCell}>{details.psychiatric_Diagnosis}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Physical illnesses / Communicable Diseases: e.g. Hep B, HIV, TB, STD etc</Text>
                <Text style={styles.tableCell}>{details.physical_Illnesses}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Allergies</Text>
                <Text style={styles.tableCell}>{details.allergies}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>ACAT Orders</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they have a guardian? If yes, please providecontact details</Text>
                <Text style={styles.tableCell}>{details.guardianDetails}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Are they under Public Trustee?</Text>
                <Text style={styles.tableCell}>{details.physical_Illnesses}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Are they undera PTO? *for medication supports only</Text>
                <Text style={styles.tableCell}>{details.pto}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>Compliance with NDIS Condition 73G</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Is the participant currently engaged with other providers? </Text>
                <Text style={styles.tableCell}>{details.participant_Providers}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Does the participant have regular interaction with family and/ or friends? </Text>
                <Text style={styles.tableCell}>{details.participant_Interraction}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Did the participant engage well with previous providers? </Text>
                <Text style={styles.tableCell}>{details.participant_Engagement}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>Risk Assessment</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Current use of illicit substances or alcohol:
Will this pose a safety risk to staff? e.g. becomes violent when under the influence, smokes within house etc. </Text>
                <Text style={styles.tableCell}>{details.illicit_Substances}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Are they a falls risk? </Text>
                <Text style={styles.tableCell}>{details.falls_Risk}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they have pets? </Text>
                <Text style={styles.tableCell}>{details.pets}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Any other potential risks to staff? </Text>
                <Text style={styles.tableCell}>{details.potential_Risk}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>Mental Health</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Past suicide attempts/ self-harm  </Text>
                <Text style={styles.tableCell}>{details.self_Harm}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Any known triggers/ high risk situations? </Text>
                <Text style={styles.tableCell}>{details.triggers}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>How do they present when unwell? </Text>
                <Text style={styles.tableCell}>{details.unwell_Presentation}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>De-escalation strategie </Text>
                <Text style={styles.tableCell}>{details.de_escalation}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Any history ofaggression towards others? </Text>
                <Text style={styles.tableCell}>{details.aggression_History}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they havea behavior support plan? If yes, please attach. </Text>
                <Text style={styles.tableCell}>{details.behavior_Plan}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>Supports Required (for one-on-oneservices)</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>What support are you engaging MaxiCare Plus for?  </Text>
                <Text style={styles.tableCell}>{details.support_Details}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>What days/ times does the client require MaxiCare Plus to support them? </Text>
                <Text style={styles.tableCell}>{details.support_Time}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do you require support on Public Holidays? </Text>
                <Text style={styles.tableCell}>{details.support_Holiday}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Any preference in staff? </Text>
                <Text style={styles.tableCell}>{details.staff_Preference}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>Supports Required (for group activities)</Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Which group activities are they interested in?  </Text>
                <Text style={styles.tableCell}>{details.activity_group}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Are they able to find transport to and from the groups? </Text>
                <Text style={styles.tableCell}>{details.transport}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Do they require extra support whilst attending groups? one-on- one supervision etc. </Text>
                <Text style={styles.tableCell}>{details.extra_Support}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Support Coordinator’s Name & Contact Details </Text>
                <Text style={styles.tableCell}>{details.supportCoordinator}</Text>
              </View>
            </View>

            <Text style={styles.tableCellHeader}>Referral </Text>

            {/* Table to display data */}
            <View style={styles.table}>
              {/* Table Rows */}
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Referrer’s Name:  </Text>
                <Text style={styles.tableCell}>{details.referralName}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Referrer’s Email: </Text>
                <Text style={styles.tableCell}>{details.referralEmail}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Referrer’s Phone Number: </Text>
                <Text style={styles.tableCell}>{details.referralPhone}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Referrer’s Signature: </Text>
                <Text style={styles.tableCell}>{details.referralSignature}</Text>
              </View>
            </View>

          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default RefferalDetails;


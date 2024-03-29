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

// const FormTemplateDetails = () => {
//     const { uid } = useParams();
//     const [details, setDetails] = useState({});
//     const [isLoading, setIsLoading] = useState(true);

//     const { get } = useHttp();

//     const fetchDetails = async () => {
//         try {
//             const { data } = await get(`/Templates/template_details/${uid}`, { cacheTimeout: 300000 });
//             // console.log(data);
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

// export default FormTemplateDetails;

import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer } from "@react-pdf/renderer";
import useHttp from "../../../hooks/useHttp";
import logo from "../../../assets/img/logo.png";
import { useParams } from "react-router-dom";
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
});

const FormTemplateDetails = () => {
  const { uid } = useParams();
  const [details, setDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { get } = useHttp();

  const fetchDetails = async () => {
    try {
      const { data } = await get(`/Templates/template_details/${uid}`, { cacheTimeout: 300000 });
      // console.log(data);
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
  const removeHtmlTags = (html) => {
        const cleanText = html.replace(/<\/?[^>]+(>|$)/g, "");
        return cleanText;
    };

  const parsedContent = details.content ? parse(removeHtmlTags(details.content.replace(/\\"/g, '"'))) : null;
// const parsedContent = details.content ? parse(details.content.replace(/\\"/g, '"')) : null;
console.log(parsedContent);
  return (
    <PDFViewer width="100%" height={800}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <Image src={logo} style={styles.logo} />
              <Text style={styles.title}>Form Template</Text>
              <Text style={styles.subtitle}>{details.templateName}</Text>
            </View>

            <View style={styles.content}>
              <Text>{parsedContent}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default FormTemplateDetails;


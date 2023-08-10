import React from "react";
import { Document, Page, PDFViewer } from "@react-pdf/renderer";

const PdfRenderer = ({ content }) => {
    return (
        <PDFViewer width="100%" height={800}>
            <Document>
                <Page size="A4">
                    {content}
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default PdfRenderer;
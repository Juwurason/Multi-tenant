/**
 * Form Elemets
 */
 import React, { useEffect, useState } from 'react';
 import { CopyToClipboard } from 'react-copy-to-clipboard';
 import { CSVLink } from 'react-csv';
 import DataTable from 'react-data-table-component';
 import { Helmet } from "react-helmet";
 import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa';
 import { GoSearch } from 'react-icons/go';
 import { useDispatch, useSelector } from 'react-redux';
 import { Link } from 'react-router-dom';
 import { toast } from 'react-toastify';
 import Swal from 'sweetalert2';
 import useHttp from '../../../hooks/useHttp';
 import dayjs from 'dayjs';
import { fetchRefferals } from '../../../store/slices/RefferalsSlice';
 
 
 const Refferal = () => {
     useEffect(() => {
         if ($('.select').length > 0) {
             $('.select').select2({
                 minimumResultsForSearch: -1,
                 width: '100%'
             });
         }
     });
 
     const id = JSON.parse(localStorage.getItem('user'));
     const [loading2, setLoading2] = useState(false);
     const { get, post } = useHttp();
     const dispatch = useDispatch();
 
     useEffect(() => {
         dispatch(fetchRefferals(id.companyId));
     }, [dispatch]);
 
     const loading = useSelector((state) => state.refferals.isLoading);
     const refferals = useSelector((state) => state.refferals.data);
     console.log(refferals[0]);
     const columns = [
 
         {
             name: 'FullName',
             selector: row => row.FullName,
             sortable: true,
 
         },
         {
             name: 'Status',
             selector: row => row.FullName,
             sortable: true,
 
         },

         {
             name: 'Current Residence',
             selector: row => row.FullName,
             sortable: true,
 
         },

         {
             name: 'Contact Number',
             selector: row => row.FullName,
             sortable: true,
 
         },
         {
             name: 'NDIS No',
             selector: row => row.FullName,
             sortable: true,
 
         },
 
        //  {
        //      name: "Actions",
        //      cell: (row) => (
 
        //          <div className="p-2 d-flex flex-column gap-2 overflow-hidden" style={{ fontSize: "12px" }}>
 
        //              <div>
 
        //                  {
        //                      row.templateUrl ?
        //                          <button className="btn text-secondary" style={{ fontSize: "12px" }}
        //                              onClick={() => handleView(row.templateUrl)}>
 
        //                              View
        //                          </button> :
 
 
        //                          <Link to={`/app/employee/fillForm/${row.templateId}`} className="btn text-secondary" style={{ fontSize: "12px" }}
        //                          // onClick={() => handleDetails(row.templateId)}
        //                          >
        //                              {
        //                                  loading2 ?
        //                                      <>
        //                                          <span className="spinner-border text-white spinner-border-sm me-2" aria-hidden="true" />
        //                                          Please wait...
        //                                      </>
        //                                      :
        //                                      "Fill Form"
 
        //                              }
        //                          </Link>
        //                  }
 
        //              </div>
 
        //          </div >
        //      ),
        //  }
 
 
     ];
 
 
 
 
 
 
     const handleExcelDownload = () => {
         const workbook = new ExcelJS.Workbook();
         const sheet = workbook.addWorksheet('Sheet1');
 
         // Add headers
         const headers = columns.map((column) => column.name);
         sheet.addRow(headers);
 
         // Add data
         template.forEach((dataRow) => {
             const values = columns.map((column) => {
                 if (typeof column.selector === 'function') {
                     return column.selector(dataRow);
                 }
                 return dataRow[column.selector];
             });
             sheet.addRow(values);
         });
 
         // Generate Excel file
         workbook.xlsx.writeBuffer().then((buffer) => {
             const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             const url = URL.createObjectURL(blob);
             const link = document.createElement('a');
             link.href = url;
             link.download = 'refferals.xlsx';
             link.style.visibility = 'hidden';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
         });
     };
 
 
 
     const handleCSVDownload = () => {
         const csvData = Papa.unparse(refferals);
         const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
         const url = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.setAttribute("href", url);
         link.setAttribute("download", "refferals.csv");
         link.style.visibility = "hidden";
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
     };
 
     const handlePDFDownload = () => {
         const unit = "pt";
         const size = "A4"; // Use A1, A2, A3 or A4
         const orientation = "portrait"; // portrait or landscape
         const marginLeft = 40;
         const doc = new jsPDF(orientation, unit, size);
         doc.setFontSize(13);
         doc.text("refferals Table", marginLeft, 40);
         const headers = columns.map((column) => column.name);
         const dataValues = refferals.map((dataRow) =>
             columns.map((column) => {
                 if (typeof column.selector === "function") {
                     return column.selector(dataRow);
                 }
                 return dataRow[column.selector];
             })
         );
 
         doc.autoTable({
             startY: 50,
             head: [headers],
             body: dataValues,
             margin: { top: 50, left: marginLeft, right: marginLeft, bottom: 0 },
         });
         doc.save("refferals.pdf");
     };
     const handleView = (refferalsUrl) => {
         window.open(refferalsUrl, '_blank');
     };
     {/* const handleDetails = (e) => {
         setLoading2(true);
         setTimeout(() => {
             const url = `/form-details/${e}`;
             window.open(url, '_blank');
             setLoading2(false);
         }, 2000);
     }; */}
 
     const [searchText, setSearchText] = useState("");
 
     const handleSearch = (event) => {
         setSearchText(event.target.value);
     };
 
     const filteredData = refferals.filter((item) =>
         item.fullName.toLowerCase().includes(searchText.toLowerCase())
     );
     const customStyles = {
 
         headCells: {
             style: {
                 paddingLeft: '8px', // override the cell padding for head cells
                 paddingRight: '8px',
             },
         },
         cells: {
             style: {
                 paddingLeft: '8px', // override the cell padding for data cells
                 paddingRight: '8px',
             },
         },
     };
 
     const handleDelete = async (e) => {
         Swal.fire({
             html: `<h3>Are you sure? you want to delete this template</h3>`,
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#405189',
             cancelButtonColor: '#777',
             confirmButtonText: 'Confirm Delete',
             showLoaderOnConfirm: true,
         }).then(async (result) => {
             if (result.isConfirmed) {
                 try {
                     const { data } = await post(`/Templates/delete/${e}`,
 
                     )
                     if (data.status === 'Success') {
                         toast.success(data.message);
                         dispatch(fetchTemplate(id.companyId));
                     } else {
                         toast.error(data.message);
                     }
 
 
                 } catch (error) {
                     console.log(error);
                     toast.error(error.response.data.message)
                     toast.error(error.response.data.title)
 
                 }
 
 
             }
         })
 
     }
 
     
 
 
     return (
         <div className="page-wrapper">
             <Helmet>
                 <title> Refferal</title>
                 <meta name="description" content="Refferal" />
             </Helmet>
             <div className="content container-fluid">
                 {/* Page Header */}
                 <div className="page-header">
                     <div className="row">
                         <div className="col">
                             <ul className="breadcrumb">
                                 <li className="breadcrumb-item"><Link to="/app/main/dashboard">Dashboard</Link></li>
                                 <li className="breadcrumb-item active">Refferal</li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 {/* /Page Header */}
 
 
 
                 <label className='d-flex justify-content-center align-items-center'> Forms </label>
                 <div className='mt-4 border'>
                     <div className="row px-2 py-3">
 
                         <div className="col-md-3">
                             <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                                 <input type="text" placeholder="Search..." className='border-0 outline-none' onChange={handleSearch} />
                                 <GoSearch />
                             </div>
                         </div>
                         <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                             <CSVLink
                                 data={refferals}
                                 filename={"refferals.csv"}
 
                             >
                                 <button
 
                                     className='btn text-info'
                                     title="Export as CSV"
                                 >
                                     <FaFileCsv />
                                 </button>
 
                             </CSVLink>
                             <button
                                 className='btn text-danger'
                                 onClick={handlePDFDownload}
                                 title="Export as PDF"
                             >
                                 <FaFilePdf />
                             </button>
                             <button
                                 className='btn text-primary'
 
                                 onClick={handleExcelDownload}
                                 title="Export as Excel"
                             >
                                 <FaFileExcel />
                             </button>
                             <CopyToClipboard text={JSON.stringify(refferals)}>
                                 <button
 
                                     className='btn text-warning'
                                     title="Copy Table"
                                     onClick={() => toast("Table Copied")}
                                 >
                                     <FaCopy />
                                 </button>
                             </CopyToClipboard>
                         </div>
                         <div className='col-md-4'>
                             {/* <Link to="/administrator/createClient" className="btn btn-info add-btn rounded-2">
                 Add New Holiday</Link> */}
                             {/* <Link
                                 to={"/app/setup/create-template"}
                                 className="btn btn-info add-btn rounded-2 text-white">Add New Template</Link> */}
                         </div>
                     </div>
                     <DataTable data={filteredData} columns={columns}
                         pagination
                         highlightOnHover
                         searchable
                         searchTerm={searchText}
                         progressPending={loading}
                         progressComponent={<div className='text-center fs-1'>
                             <div className="spinner-grow text-secondary">
                                 <span className="sr-only">Loading...</span>
                             </div>
                         </div>}
                         // expandableRows
                         // expandableRowsComponent={ButtonRow}
                         paginationTotalRows={filteredData.length}
                         customStyles={customStyles}
                         responsive
 
                     />
 
 
                     {/*Edit Modal */}
 
 
                 </div>
 
 
 
             </div>
 
         </div>
     );
 }

export default Refferal;
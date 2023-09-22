import React from "react";
import { Modal } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import { FaCopy, FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { toast } from "react-toastify";

const ProfileDetail = ({ handleModal1, profile, stateModal, setStateModal, editedProfile, handleInputChange, handleSave, handleSearch,
    loading, staffOne, handleModal2, kinModal, setKinModal, handleModal3, bankModal, setBankModal, clientRoster,
    handlePDFDownload,
    handleExcelDownload,
    filteredData,
    columns,
    searchText,
    ButtonRow,
    loading0
}) => {
    return (
        <>
            <div className="row">
                <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                        <div className="card-body">
                            <div className="pro-edit">
                                <a className="edit-icon bg-info text-white" onClick={() => handleModal1(staffOne.profileId)}>
                                    <i className="fa fa-pencil" />
                                </a>
                                <Modal
                                    show={stateModal}
                                    onHide={() => setStateModal(false)}
                                    size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"

                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                                            Update profile for {profile.surName} {profile.firstName}
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="row">


                                            <div className="form-group col-md-6">
                                                <label>State</label>
                                                <input type="text" className="form-control" name='state' value={editedProfile.state || ''} onChange={handleInputChange} />
                                            </div>


                                            <div className="form-group col-md-6">
                                                <label>City</label>
                                                <input type="text" className="form-control" name='city' value={editedProfile.city || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Country</label>
                                                <input type="text" className="form-control" name='country' value={editedProfile.country || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Post Code</label>
                                                <input type="text" className="form-control" name='postcode' value={editedProfile.postcode || ''} onChange={handleInputChange} />
                                            </div>


                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button
                                            className="btn add-btn rounded btn-outline-danger"
                                            onClick={() => setStateModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="ml-2 btn add-btn rounded text-white btn-info"
                                            onClick={handleSave}
                                        >
                                            {loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Send"}
                                        </button>
                                    </Modal.Footer>

                                </Modal>

                            </div>
                            <h3 className="card-title">Postal Address</h3>
                            <ul className="personal-info">
                                <li>
                                    <div className="title">Address Line 1</div>
                                    <div className="text">{staffOne.address}</div>
                                </li>
                                <li>
                                    <div className="title">Country</div>
                                    <div className="text">{staffOne.country === "null" ? "---" : staffOne.country}</div>
                                </li>
                                <li>
                                    <div className="title">State</div>
                                    <div className="text">{staffOne.state === "null" ? "---" : staffOne.state}</div>
                                </li>
                                <li>
                                    <div className="title">City</div>
                                    <div className="text">{staffOne.city === "null" ? "---" : staffOne.city}</div>
                                </li>
                                <li>
                                    <div className="title">Post Code</div>
                                    <div className="text">{staffOne.postcode === "null" ? "---" : staffOne.postcode}</div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact Info */}
                <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                        <div className="card-body">
                            <div className="pro-edit">
                                <a className="edit-icon bg-info text-white" onClick={() => handleModal2(staffOne.profileId)}>
                                    <i className="fa fa-pencil" />
                                </a>
                                <Modal
                                    show={kinModal}
                                    onHide={() => setKinModal(false)}
                                    size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"

                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>
                                            Emergency Contact Information
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label>Emergency Contact FullName</label>
                                                <input type="text" className="form-control" name='nextOfKin' value={editedProfile.nextOfKin || ''} onChange={handleInputChange} />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Relationship</label>
                                                <input type="text" className="form-control" name='relationship' value={editedProfile.relationship || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>State</label>
                                                <input type="text" className="form-control" name='kinState' value={editedProfile.kinState || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>Email</label>
                                                <input type="email" className="form-control" name='kinEmail' value={editedProfile.kinEmail || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>Post Code</label>
                                                <input type="email" className="form-control" name='kinPostcode' value={editedProfile.kinPostcode || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>Address</label>
                                                <input type="text" className="form-control" name='kinAddress' value={editedProfile.kinAddress || ''} onChange={handleInputChange} />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Country</label>
                                                <input type="text" className="form-control" name='kinCountry' value={editedProfile.kinCountry || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>City</label>
                                                <input type="text" className="form-control" name='kinCity' value={editedProfile.kinCity || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>Phone Number</label>
                                                <input type="email" className="form-control" name='kinPhoneNumber' value={editedProfile.kinPhoneNumber || ''} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>Suburb</label>
                                                <input type="email" className="form-control" name='kinSuburb' value={editedProfile.kinSuburb || ''} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button
                                            className="btn add-btn rounded btn-outline-danger"
                                            onClick={() => setKinModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="ml-2 btn add-btn rounded text-white btn-info"
                                            onClick={handleSave}
                                        >
                                            {loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Send"}
                                        </button>
                                    </Modal.Footer>

                                </Modal>
                            </div>
                            <h3 className="card-title">Emergency Contact </h3>
                            <ul className="personal-info">
                                <li>
                                    <div className="title">Name</div>
                                    <div className="text">{staffOne.nextOfKin === "null" ? "---" : staffOne.nextOfKin}</div>
                                </li>
                                <li>
                                    <div className="title">Relationship</div>
                                    <div className="text">{staffOne.relationship === "null" ? "---" : staffOne.relationship}</div>
                                </li>
                                <li>
                                    <div className="title">Email</div>
                                    <div className="text">{staffOne.kinEmail === "null" ? "---" : staffOne.kinEmail}</div>
                                </li>
                                <li>
                                    <div className="title">Phone </div>
                                    <div className="text">{staffOne.kinPhoneNumber === "null" ? "---" : staffOne.kinPhoneNumber}</div>
                                </li>

                                <li>
                                    <div className="title">Country</div>
                                    <div className="text">{staffOne.kinCountry === "null" ? "---" : staffOne.kinCountry}</div>
                                </li>
                                <li>
                                    <div className="title">State</div>
                                    <div className="text">{staffOne.kinState === "null" ? "---" : staffOne.kinState}</div>
                                </li>
                                <li>
                                    <div className="title">City</div>
                                    <div className="text">{staffOne.kinCity === "null" ? "---" : staffOne.kinCity}</div>
                                </li>
                                <li>
                                    <div className="title">Post Code</div>
                                    <div className="text">{staffOne.kinPostcode === "null" ? "---" : staffOne.kinPostcode}</div>
                                </li>

                            </ul>


                        </div>
                    </div>
                </div>
            </div>

            {/* modal 3 */}
            <div className="row">
                <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                        <div className="card-body">
                            <div className="pro-edit">
                                <a className="edit-icon bg-info text-white" onClick={() => handleModal3(staffOne.profileId)}>
                                    <i className="fa fa-pencil" />
                                </a>
                                <Modal
                                    show={bankModal}
                                    onHide={() => setBankModal(false)}
                                    size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"

                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: "10px" }}>

                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="row">

                                            <div className="form-group col-md-4">
                                                <label>Cultural Background</label>
                                                <input type="text" className="form-control" name='culturalBackground' value={editedProfile.culturalBackground || ''} onChange={handleInputChange} />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Preferred Language</label>
                                                <input type="text" className="form-control" name='preferredLanguage' value={editedProfile.preferredLanguage || ''} onChange={handleInputChange} />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Privacy Preferences</label><br />
                                                <textarea className='form-control' name="privacyPreferences" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.privacyPreferences || ''} onChange={handleInputChange}></textarea>
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Do you have an NDIS plan?</label>
                                                <select className="form-control" name='ndisPlan' value={editedProfile.ndisPlan || ''} onChange={handleInputChange}>
                                                    <option defaultValue hidden>Please select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Indigenous Satatus</label>
                                                <select className="form-control" name='indigenousSatatus' value={editedProfile.indigenousSatatus || ''} onChange={handleInputChange}>
                                                    <option defaultValue hidden>Please select</option>
                                                    <option value="Aboriginal and Torres Strait Islander">Aboriginal and Torres Strait Islander</option>
                                                    <option value="Aboriginal">Aboriginal</option>
                                                    <option value="Torres Strait Islander">Torres Strait Islander</option>
                                                    <option value="Not Aboriginal or Torres Strait Islander">Not Aboriginal or Torres Strait Islander</option>
                                                </select>
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label>Interpreter Required?</label>
                                                <select className="form-control" name='requireInterpreter' value={editedProfile.requireInterpreter || ''} onChange={handleInputChange}>
                                                    <option defaultValue hidden>Please select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label>Financial Arrangement</label><br />
                                                <textarea className='form-control' name="financialArrangement" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.financialArrangement || ''} onChange={handleInputChange}></textarea>
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label>NDIS Plan Notes If Yes above, Include Plan approval Date and if No, State reason (e.g waiting for plan approval or plan review)</label><br />
                                                <textarea className='form-control' name="ndisPlanNote" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.ndisPlanNote || ''} onChange={handleInputChange}></textarea>
                                            </div>

                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button
                                            className="btn add-btn rounded btn-outline-danger"
                                            onClick={() => setBankModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="ml-2 btn add-btn rounded text-white btn-info"
                                            onClick={handleSave}
                                        >
                                            {loading ? <div className="spinner-grow text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div> : "Send"}
                                        </button>
                                    </Modal.Footer>

                                </Modal>

                            </div>
                            <h3 className="card-title"></h3>
                            <ul className="personal-info">
                                <li>
                                    <div className="title">Cultural Background</div>
                                    <div className="text">{staffOne.culturalBackground === "null" ? "---" : staffOne.culturalBackground}</div>
                                </li>
                                <li>
                                    <div className="title">Preferred Language</div>
                                    <div className="text">{staffOne.preferredLanguage === "null" ? "---" : staffOne.preferredLanguage}</div>
                                </li>
                                <li>
                                    <div className="title">Privacy Preferences</div>
                                    <div className="text">{staffOne.privacyPreferences === "null" ? "---" : staffOne.privacyPreferences}</div>
                                </li>
                                <li>
                                    <div className="title">Do you have an NDIS plan </div>
                                    <div className="text"> {staffOne.ndisPlan === "null" ? "---" : staffOne.ndisPlan}</div>
                                </li>
                                <li>
                                    <div className="title">Indigenous Satatus</div>
                                    <div className="text">{staffOne.indigenousSatatus === "null" ? "---" : staffOne.indigenousSatatus}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <label className='d-flex justify-content-center align-items-center'>{staffOne.fullName} Shift Roster</label>
            <div className='mt-4 border'>
                <div className="row px-2 py-3 d-flex justify-content-between align-items-center gap-4">

                    <div className="col-md-3">
                        <div className='d-flex justify-content-between border align-items-center rounded rounded-pill p-2'>
                            <input type="text" placeholder="Search...." className='border-0 outline-none' onChange={handleSearch} />
                            <GoSearch />
                        </div>
                    </div>
                    <div className='col-md-5 d-flex  justify-content-center align-items-center gap-4'>
                        <CSVLink
                            data={clientRoster}
                            filename={"document.csv"}

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
                        <CopyToClipboard text={JSON.stringify(clientRoster)}>
                            <button

                                className='btn text-warning'
                                title="Copy Table"
                                onClick={() => toast("Table Copied")}
                            >
                                <FaCopy />
                            </button>
                        </CopyToClipboard>
                    </div>
                </div>
                <DataTable data={filteredData} columns={columns}
                    pagination
                    highlightOnHover
                    searchable
                    searchTerm={searchText}
                    progressPending={loading0}
                    progressComponent={<div className='text-center fs-1'>
                        <div className="spinner-grow text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>}
                    expandableRows
                    expandableRowsComponent={ButtonRow}
                    paginationTotalRows={filteredData.length}
                    responsive


                />



            </div>
        </>

    );
}

export default ProfileDetail;
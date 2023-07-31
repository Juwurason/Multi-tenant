import React from "react";

const Form = ({ setCli, setSta, staff, clients, dateFrom, dateTo, GetPeriodic, loading, SendRosterNotice, loading3 }) => {
    return (


        <div className="row">
            <div className="col-md-12">
                <div className="card">

                    <div className="card-body">
                        <div className="row align-items-center py-2">

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="col-form-label">Staff Name</label>
                                    <div>
                                        <select className="form-select" onChange={e => setSta(e.target.value)}>
                                            <option defaultValue hidden>--Select a staff--</option>
                                            <option value="">All Staff</option>
                                            {
                                                staff.map((data, index) =>
                                                    <option value={data.staffId} key={index}>{data.fullName}</option>)
                                            }
                                        </select></div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="col-form-label">Client Name</label>
                                    <div>
                                        <select className="form-select" onChange={e => setCli(e.target.value)}>
                                            <option defaultValue hidden>--Select a Client--</option>
                                            <option value="">All Clients</option>
                                            {
                                                clients.map((data, index) =>
                                                    <option value={data.profileId} key={index}>{data.fullName}</option>)
                                            }
                                        </select></div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="col-form-label">Start Date</label>
                                    <div>
                                        <input type="date" ref={dateFrom} className='form-control' name="" id="" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="col-form-label">End Date</label>
                                    <div>
                                        <input type="date" ref={dateTo} className=' form-control' name="" id="" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-auto mt-3">
                                <div className="form-group">
                                    <button onClick={GetPeriodic} className="btn btn-info add-btn text-white rounded-2 m-r-5"
                                        disabled={loading ? true : false}
                                    >

                                        {loading ? <div class="spinner-border text-light text-sm spinner-border-sm" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div> : "Load"}
                                    </button>

                                </div>
                            </div>

                            <div className="col-auto mt-3">
                                <div className="form-group">
                                    <button className="btn btn-primary add-btn rounded-2 m-r-5"
                                        onClick={SendRosterNotice}
                                    >
                                        {loading3 ? <div className="spinner-grow text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Send Roster Notification"}
                                    </button>

                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;

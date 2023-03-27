/**
 * TermsCondition Page
 */
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_05, Avatar_09, Avatar_10, Avatar_16 } from '../../../Entryfile/imagepath'
import Offcanvas from '../../../Entryfile/offcanvance';

const StaffProfile = () => {
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });
  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>Profile</title>
          <meta name="description" content="Reactify Blank Page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Profile</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/staff/staff/staffDashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Profile</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <a href="#"><img alt="" src={Avatar_02} /></a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0 mb-0">John Doe</h3>
                            <h6 className="text-muted">MCP202224</h6>
                            <small className="text-muted">johndoe@example.com</small>
                            <div className="staff-id">Employee ID : FT-0001</div>
                            <div className="small doj text-muted">1861 Bayonne Ave, Manchester Township, NJ, 08759</div>
                            <div className="staff-msg"><Link onClick={() => localStorage.setItem("minheight", "true")} className="btn btn-custom" to="/conversation/chat">Message</Link></div>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <div className="title">Phone:</div>
                              <div className="text"><a href="">9876543210</a></div>
                            </li>
                            <li>
                              <div className="title">Email:</div>
                              <div className="text"><a href="">johndoe@example.com</a></div>
                            </li>
                            <li>
                              <div className="title">Birthday:</div>
                              <div className="text">24th July</div>
                            </li>
                            <li>
                              <div className="title">Address:</div>
                              <div className="text">1861 Bayonne Ave, Manchester Township, NJ, 08759</div>
                            </li>
                            <li>
                              <div className="title">Gender:</div>
                              <div className="text">Male</div>
                            </li>
                            <li>
                              <div className="title">Reports to:</div>
                              <div className="text">
                                <div className="avatar-box">
                                  <div className="avatar avatar-xs">
                                    <img src={Avatar_16} alt="" />
                                  </div>
                                </div>
                                <Link to="/staff/Staffprofile">
                                  Jeffery Lalor
                                </Link>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="pro-edit"><a data-bs-toggle="modal" data-bs-target="#staticBackdrop" className="edit-icon" href="#"><i className="fa fa-pencil" /></a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item"><a href="#emp_profile" data-bs-toggle="tab" className="nav-link active">Profile</a></li>
                  {/* <li className="nav-item"><a href="#emp_projects" data-bs-toggle="tab" className="nav-link">Projects</a></li> */}
                  {/* <li className="nav-item"><a href="#bank_statutory" data-bs-toggle="tab" className="nav-link">Bank &amp; Statutory <small className="text-danger">(Admin Only)</small></a></li> */}
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content">
            {/* Profile Info Tab */}
            <div id="emp_profile" className="pro-overview tab-pane fade show active">
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Personal Informations <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#personal_info_modal"><i className="fa fa-pencil" /></a></h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Passport No.</div>
                          <div className="text">9876543210</div>
                        </li>
                        <li>
                          <div className="title">Passport Exp Date.</div>
                          <div className="text">9876543210</div>
                        </li>
                        <li>
                          <div className="title">Tel</div>
                          <div className="text"><a href="">9876543210</a></div>
                        </li>
                        <li>
                          <div className="title">Nationality</div>
                          <div className="text">Indian</div>
                        </li>
                        <li>
                          <div className="title">Religion</div>
                          <div className="text">Christian</div>
                        </li>
                        <li>
                          <div className="title">Marital status</div>
                          <div className="text">Married</div>
                        </li>
                        <li>
                          <div className="title">Employment of spouse</div>
                          <div className="text">No</div>
                        </li>
                        <li>
                          <div className="title">No. of children</div>
                          <div className="text">2</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Emergency Contact <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#emergency_contact_modal"><i className="fa fa-pencil" /></a></h3>
                      <h5 className="section-title">Primary</h5>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Name</div>
                          <div className="text">John Doe</div>
                        </li>
                        <li>
                          <div className="title">Relationship</div>
                          <div className="text">Father</div>
                        </li>
                        <li>
                          <div className="title">Phone </div>
                          <div className="text">9876543210, 9876543210</div>
                        </li>
                      </ul>
                      <hr />
                      <h5 className="section-title">Secondary</h5>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Name</div>
                          <div className="text">Karen Wills</div>
                        </li>
                        <li>
                          <div className="title">Relationship</div>
                          <div className="text">Brother</div>
                        </li>
                        <li>
                          <div className="title">Phone </div>
                          <div className="text">9876543210, 9876543210</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Bank information</h3>
                      <ul className="personal-info">
                        <li>
                          <div className="title">Bank name</div>
                          <div className="text">ICICI Bank</div>
                        </li>
                        <li>
                          <div className="title">Bank account No.</div>
                          <div className="text">159843014641</div>
                        </li>
                        <li>
                          <div className="title">IFSC Code</div>
                          <div className="text">ICI24504</div>
                        </li>
                        <li>
                          <div className="title">PAN No</div>
                          <div className="text">TC000Y56</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Family Informations <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#family_info_modal"><i className="fa fa-pencil" /></a></h3>
                      <div className="table-responsive">
                        <table className="table table-nowrap">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Relationship</th>
                              <th>Date of Birth</th>
                              <th>Phone</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Leo</td>
                              <td>Brother</td>
                              <td>Feb 16th, 2019</td>
                              <td>9876543210</td>
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <a href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                                    <a href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Education Informations <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#education_info"><i className="fa fa-pencil" /></a></h3>
                      <div className="experience-box">
                        <ul className="experience-list">
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                <a href="/" className="name">International College of Arts and Science (UG)</a>
                                <div>Bsc Computer Science</div>
                                <span className="time">2000 - 2003</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                <a href="/" className="name">International College of Arts and Science (PG)</a>
                                <div>Msc Computer Science</div>
                                <span className="time">2000 - 2003</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 d-flex">
                  <div className="card profile-box flex-fill">
                    <div className="card-body">
                      <h3 className="card-title">Experience <a href="#" className="edit-icon" data-bs-toggle="modal" data-bs-target="#experience_info"><i className="fa fa-pencil" /></a></h3>
                      <div className="experience-box">
                        <ul className="experience-list">
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                <a href="/" className="name">Web Designer at Zen Corporation</a>
                                <span className="time">Jan 2013 - Present (5 years 2 months)</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                <a href="/" className="name">Web Designer at Ron-tech</a>
                                <span className="time">Jan 2013 - Present (5 years 2 months)</span>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="experience-user">
                              <div className="before-circle" />
                            </div>
                            <div className="experience-content">
                              <div className="timeline-content">
                                <a href="/" className="name">Web Designer at Dalt Technology</a>
                                <span className="time">Jan 2013 - Present (5 years 2 months)</span>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Profile Info Tab */}
            {/* Projects Tab */}
            <div className="tab-pane fade" id="emp_projects">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Office Management</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">1</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">9</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Project Management</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">2</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">5</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Video Calling App</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">3</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">3</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-sm-6 col-md-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="dropdown profile-action">
                        <a aria-expanded="false" data-bs-toggle="dropdown" className="action-icon dropdown-toggle" href="#"><i className="material-icons">more_vert</i></a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a data-bs-target="#edit_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-pencil m-r-5" /> Edit</a>
                          <a data-bs-target="#delete_project" data-bs-toggle="modal" href="#" className="dropdown-item"><i className="fa fa-trash-o m-r-5" /> Delete</a>
                        </div>
                      </div>
                      <h4 className="project-title"><Link to="/app/projects/projects-view">Hospital Administration</Link></h4>
                      <small className="block text-ellipsis m-b-15">
                        <span className="text-xs">12</span> <span className="text-muted">open tasks, </span>
                        <span className="text-xs">4</span> <span className="text-muted">tasks completed</span>
                      </small>
                      <p className="text-muted">Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. When an unknown printer took a galley of type and
                        scrambled it...
                      </p>
                      <div className="pro-deadline m-b-15">
                        <div className="sub-title">
                          Deadline:
                        </div>
                        <div className="text-muted">
                          17 Apr 2019
                        </div>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Project Leader :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Jeffery Lalor"><img alt="" src={Avatar_16} /></a>
                          </li>
                        </ul>
                      </div>
                      <div className="project-members m-b-15">
                        <div>Team :</div>
                        <ul className="team-members">
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Doe"><img alt="" src={Avatar_02} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Richard Miles"><img alt="" src={Avatar_09} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="John Smith"><img alt="" src={Avatar_10} /></a>
                          </li>
                          <li>
                            <a href="#" data-bs-toggle="tooltip" title="Mike Litorus"><img alt="" src={Avatar_05} /></a>
                          </li>
                          <li>
                            <a href="#" className="all-users">+15</a>
                          </li>
                        </ul>
                      </div>
                      <p className="m-b-5">Progress <span className="text-success float-end">40%</span></p>
                      <div className="progress progress-xs mb-0">
                        <div style={{ width: '40%' }} data-bs-toggle="tooltip" role="progressbar" className="progress-bar bg-success" data-original-title="40%" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Projects Tab */}
            {/* Bank Statutory Tab */}
            <div className="tab-pane fade" id="bank_statutory">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title"> Basic Salary Information</h3>
                  <form>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Salary basis <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select salary basis type</option>
                            <option>Hourly</option>
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Salary amount <small className="text-muted">per month</small></label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input type="text" className="form-control" placeholder="Type your salary amount" defaultValue={0.00} />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Payment type</label>
                          <select className="select">
                            <option>Select payment type</option>
                            <option>Bank transfer</option>
                            <option>Check</option>
                            <option>Cash</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h3 className="card-title"> PF Information</h3>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">PF contribution</label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">PF No. <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Employee PF rate</label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Additional rate <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select additional rate</option>
                            <option>0%</option>
                            <option>1%</option>
                            <option>2%</option>
                            <option>3%</option>
                            <option>4%</option>
                            <option>5%</option>
                            <option>6%</option>
                            <option>7%</option>
                            <option>8%</option>
                            <option>9%</option>
                            <option>10%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Total rate</label>
                          <input type="text" className="form-control" placeholder="N/A" defaultValue="11%" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Employee PF rate</label>
                          <select className="select">
                            <option>Select PF contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Additional rate <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select additional rate</option>
                            <option>0%</option>
                            <option>1%</option>
                            <option>2%</option>
                            <option>3%</option>
                            <option>4%</option>
                            <option>5%</option>
                            <option>6%</option>
                            <option>7%</option>
                            <option>8%</option>
                            <option>9%</option>
                            <option>10%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Total rate</label>
                          <input type="text" className="form-control" placeholder="N/A" defaultValue="11%" />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h3 className="card-title"> ESI Information</h3>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">ESI contribution</label>
                          <select className="select">
                            <option>Select ESI contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">ESI No. <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select ESI contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Employee ESI rate</label>
                          <select className="select">
                            <option>Select ESI contribution</option>
                            <option>Yes</option>
                            <option>No</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Additional rate <span className="text-danger">*</span></label>
                          <select className="select">
                            <option>Select additional rate</option>
                            <option>0%</option>
                            <option>1%</option>
                            <option>2%</option>
                            <option>3%</option>
                            <option>4%</option>
                            <option>5%</option>
                            <option>6%</option>
                            <option>7%</option>
                            <option>8%</option>
                            <option>9%</option>
                            <option>10%</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label className="col-form-label">Total rate</label>
                          <input type="text" className="form-control" placeholder="N/A" defaultValue="11%" />
                        </div>
                      </div>
                    </div>
                    <div className="submit-section">
                      <button className="btn btn-primary submit-btn" type="submit">Save</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* /Bank Statutory Tab */}
          </div>
        </div>

        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h5 className="modal-title" id="staticBackdropLabel">Profile Information</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body overflow-scroll">
                <form>
                  <div className="row ">
                    <div className="col-md-12">
                      <div className="profile-img-wrap edit-img">
                        <img className="inline-block" src={Avatar_02} alt="user" />
                        <div className="fileupload btn">
                          <span className="btn-text">edit</span>
                          <input className="upload" type="file" />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>First Name</label>
                            <input type="text" className="form-control" defaultValue="John" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" className="form-control" defaultValue="Doe" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Birth Date</label>
                            <div>
                              <input className="form-control datetimepicker" type="date" defaultValue="05/06/1985" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Gender</label>
                            <select className="select form-control">
                              <option value="male selected">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" defaultValue="4487 Snowbird Lane" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>State</label>
                        <input type="text" className="form-control" defaultValue="New York" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Country</label>
                        <input type="text" className="form-control" defaultValue="United States" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Pin Code</label>
                        <input type="text" className="form-control" defaultValue={10523} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" className="form-control" defaultValue="631-889-3206" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Department <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Department</option>
                          <option>Web Development</option>
                          <option>IT Management</option>
                          <option>Marketing</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Designation <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>Select Designation</option>
                          <option>Web Designer</option>
                          <option>Web Developer</option>
                          <option>Android Developer</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Reports To <span className="text-danger">*</span></label>
                        <select className="select">
                          <option>-</option>
                          <option>Wilmer Deluna</option>
                          <option>Lesley Grauer</option>
                          <option>Jeffery Lalor</option>
                        </select>
                      </div>
                    </div>
                    <div className="submit-section">
                      <button className="btn btn-primary submit-btn">Submit</button>
                    </div>
                  </div>
                  <div className="row">
                  </div>

                </form>
              </div>

            </div>
          </div>
        </div>


      </div>
      <Offcanvas />
    </>


  );
}
export default StaffProfile;

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { MdDashboard } from 'react-icons/md';
import { emptyCache } from '../../hooks/cacheUtils';

const Sidebar = (props) => {
  const MenuMore = () => {
    document.getElementById("more-menu-hidden").classList.toggle("hidden");
  }

  const onMenuClik = () => {
    props.onMenuClick()
  }

  const [isSideMenu, setSideMenu] = useState("");
  const [isSideMenunew, setSideMenuNew] = useState("dashboard")
  const [level2Menu, setLevel2Menu] = useState("")
  const [level3Menu, setLevel3Menu] = useState("")


  const toggleSidebar = (value) => {
    setSideMenu(value);
    setSideMenuNew(value);

  }

  const toggleLvelTwo = (value) => {
    setLevel2Menu(value)
  }
  const toggleLevelThree = (value) => {
    setLevel3Menu(value)
  }


  const user = JSON.parse(localStorage.getItem('user'));
  const claims = JSON.parse(localStorage.getItem('claims'));
  const hasRequiredClaims = (claimType) => {
    return claims.some(claim => claim.value === claimType);
  };

  let pathname = props.location.pathname
  return (
    <div id="sidebar" className="sidebar bg-primary">
      <Scrollbars
        autoHide
        // autoHideTimeout={1000}
        // autoHideDuration={200}
        autoHeight
        autoHeightMin={0}
        autoHeightMax="95vh"
        thumbMinSize={30}
        universal={false}
        hideTracksWhenNotNeeded={true}


      >
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu bg-primary" style={{ height: '100vh' }}>


            { /*Vertical Sidebar starts here*/}
            <ul className="sidebar-vertical" id='veritical-sidebar'>
              <li className="menu-title">
                <span>Main</span>
              </li>
              {user.role === "CompanyAdmin" || user.role === "Administrator" || user.role === "Staff" || hasRequiredClaims("Staff Dashboard") || hasRequiredClaims("Admin Dashboard") ? (
                <li className="submenu">
                  <a href="#" className={isSideMenu === "dashboard" ? "subdrop" : ""} onClick={(e) => {
                    e.preventDefault();
                    toggleSidebar(isSideMenu === "dashboard" ? "" : "dashboard");
                  }}>
                    <i className="la la-dashboard" />
                    <span>Dashboard</span>
                    <span className="menu-arrow" />
                  </a>
                  {isSideMenu === "dashboard" ? (
                    <ul>
                      {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Admin Dashboard") ? (
                        <li>
                          <Link
                            className={pathname.includes('admin-dashboard') ? "active" : ""}
                            to="/app/main/dashboard"
                            onClick={() => onMenuClik()}
                          >
                            {user.role === "CompanyAdmin" ? "My Dashboard" : "Admin Dashboard"}
                          </Link>
                        </li>
                      ) : null}

                      {user.role === "Staff" || hasRequiredClaims("Staff Dashboard") ? (
                        <li>
                          <a href="/staff/staff/dashboard"
                            className={pathname.includes('staff-dashboard') ? "active" : ""}
                            onClick={() => onMenuClik()}
                          >
                            My Dashboard
                          </ a>
                        </li>
                      ) : null}
                      {/* {user.role !=="CompanyAdmin" && user.role !=="Staff" && user.role !=="Client" && user.role !=="Administrator" ?(
                        <li>
                        <Link to="/app/main/user-dashboard"
                          className={pathname.includes('user-dashboard') ? "active" : ""}
                          onClick={() => onMenuClik()}
                        >
                          User Dashboard
                        </ Link>
                      </li>
                      ): null} */}
                    </ul>
                  ) : null}
                </li>
              ) : <li>
              <Link to="/app/main/user-dashboard"
                className={pathname.includes('user-dashboard') ? "active" : ""}
                onClick={() => onMenuClik()}
              >
                User Dashboard
              </ Link>
            </li>}




              {/* Staff SideBar Starts */}
              {user.role === "Staff" || hasRequiredClaims("Staff Daily Report") ? <li className="menu-title">
                <span>Profile Management</span>
              </li> : ""}
              {user.role === "Staff" ? <li className={pathname.includes('profile') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/profile"><i className="la la-user" /> <span>My Profile</span></Link>
              </li> : ""}

              {user.role === "Staff" ? <li className={pathname.includes('changepassword') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/changepassword"><i className="la la-lock" /> <span>Change Password</span></Link>
              </li> : ""}
              {user.role === "Staff" ? <li className={pathname.includes('form') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/form"><i className="la la-book" /> <span>My Availabilities</span></Link>
              </li> : ""}

              {user.role === "Staff" ? <li className={pathname.includes('attendance') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/attendance"><i className="la la-calendar-check-o" /> <span>My Attendances</span></Link>
              </li> : ""}

              {user.role === "Staff" ? <li className={pathname.includes('progressNote') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/progressNote"><i className="la la-folder-open" /> <span>My Progress Note</span></Link>
              </li> : ""}

              {user.role === "Staff" ? <li className={pathname.includes('roster') || pathname.includes('roster') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/roster"><i className="la la-calendar" /> <span>My Shift Roster</span></Link>
              </li> : ""}

              {user.role === "Staff" ? <li className={pathname.includes('document') || pathname.includes('document') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/document"><i className="la la-book" /> <span>My Documents</span></Link>
              </li> : ""}

              {user.role === "Staff" || hasRequiredClaims("Staff Daily Report") ? <li className={pathname.includes('daily-report') || pathname.includes('daily-report') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/daily-report"><i className="la la-newspaper-o" /> <span>Staff Daily Report</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || hasRequiredClaims("Add & Edit Role") || hasRequiredClaims("View Administrator") || hasRequiredClaims("View Staff") || hasRequiredClaims("View Client") ? (
                <li className="menu-title">
                  <span>User Management</span>
                </li>
              ) : null}

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Account Users") ? (
                <li className="submenu">
                  <a href="#" className={isSideMenu === "management" ? "subdrop" : ""} onClick={(e) => {
                    e.preventDefault();
                    toggleSidebar(isSideMenu === "management" ? "" : "management");
                  }}>

                    <i className="la la-cog" />
                    <span>Account Management</span>
                    <span className="menu-arrow" />
                  </a>
                  {isSideMenu === "management" ? (
                    <ul>
                      {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Account Users") || hasRequiredClaims("View Activity Logs") || hasRequiredClaims("Add & Edit Role") ? (
                        <li>
                          <Link
                            className={pathname.includes('alluser') ? "active" : ""}
                            onClick={() => onMenuClik()}
                            to="/app/account/alluser"
                          >
                            Manage Users
                          </Link>
                        </li>
                      ) : null}

                      {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Add & Edit Role") ? (
                        <li>
                          <Link
                            className={pathname.includes('user-roles') ? "active" : ""}
                            onClick={() => onMenuClik()}
                            to="/app/account/user-roles"
                          >
                            Manage Roles
                          </Link>
                        </li>
                      ) : null}

                      {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View Activity Logs") ? (
                        <li>
                          <Link
                            className={pathname.includes('activity-log') ? "active" : ""}
                            onClick={() => onMenuClik()}
                            to="/app/account/activity-log"
                          >
                            Activity Logs
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  ) : null}
                </li>
              ) : null}


              {user.role === "CompanyAdmin" || hasRequiredClaims("View Administrator") ? <li className={pathname.includes('admin') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/app/employee/alladmin"><i className="la la-user-lock" /> <span>Administrators</span></Link>
              </li> : null}



              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View Staff") ?

                <li className={pathname.includes('allstaff') ? "active" : ""} onClick={() => onMenuClik()}>
                  <Link to="/app/employee/allstaff">
                    <i className="la la-user" />
                    <span>Staffs</span>
                  </Link>
                </li>
                : ""

              }

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View Client") ? <li className={pathname.includes('clients') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/app/employee/clients"><i className="la la-users" /> <span>Clients</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Referrals") ? <li className={pathname.includes('refferals') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/app/employee/refferals"><i className="la la-user-plus" /> <span>Referrals</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Service Provider") ? <li className={pathname.includes('provider') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/app/employee/provider"><i className="la la-rss-square" /> <span>Service Providers</span></Link>
              </li> : ""}






              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View & Assign Admin Roster") ? <li className="menu-title">

                <span>Rostering Management</span>
              </li> : ""}
              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Add & Delete Public Holiday") || hasRequiredClaims("Add, Edit & Delete Support of Schedule") || hasRequiredClaims("Support Coordinator") ? <li className="submenu">
                <a href="#" className={isSideMenu == "setup" ? "subdrop" : ""} onClick={(e) => {
                  e.preventDefault();
                  toggleSidebar(isSideMenu == "setup" ? "" : "setup")
                }}><i className="la la-map" /> <span>Set Up</span> <span className="menu-arrow" /></a>
                {isSideMenu == "setup" ?
                  <ul>


                    {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Add & Delete Public Holiday") || hasRequiredClaims("Add, Edit & Delete Support of Schedule") ?
                      <li><Link className={pathname.includes('public-holiday') ? "active" : pathname.includes('public-holiday')}




                        to="/app/setup/public-holiday" onClick={() => onMenuClik()}>Public Holidays</Link>
                      </li> : ""}

                    {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Add, Edit & Delete Support of Schedule") ? <li><Link className={pathname.includes('schedule-support') ? "active" : pathname.includes('schedule-support')}
                      to="/app/setup/schedule-support" onClick={() => onMenuClik()}>Schedule Supports</Link>
                    </li> : ""}

                    {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Support Coordinator") ? <li><Link className={pathname.includes('support-type') ? "active" : pathname.includes('support-type')}
                      to="/app/setup/support-type" onClick={() => onMenuClik()}>Support Type</Link>
                    </li> : ""}
                    {user.role === "CompanyAdmin" || hasRequiredClaims("Add, View, Edit & Delete Template") ? <li><Link className={pathname.includes('form-template') ? "active" : pathname.includes('form-template')}
                      to="/app/setup/form-template" onClick={() => onMenuClik()}>Form Templates</Link>
                    </li> : ""}
                    {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Time Period") ? <li><Link className={pathname.includes('time-period') ? "active" : pathname.includes('time-period')}
                      to="/app/setup/time-period" onClick={() => onMenuClik()}>Time Period</Link>
                    </li> : ""}
                    {user.role === "CompanyAdmin" || hasRequiredClaims("Third Party Integration") ? <li><Link className={pathname.includes('integrations') ? "active" : pathname.includes('integrations')}
                      to="/app/setup/integrations" onClick={() => onMenuClik()}>Third Party Integration</Link>
                    </li> : ""}

                  </ul>
                  : ""
                }
              </li> : ""}
              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View & Assign Admin Roster") || hasRequiredClaims("View Shift Roster") ? <li className={pathname.includes('shift-scheduling') || pathname.includes('shift-list') ? "active" : ""}>
                <Link to="/app/employee/shift-scheduling" onClick={() => onMenuClik()}><i className="la la-calendar" /> <span>Shift Roster</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View Progress Report") || hasRequiredClaims("Load Invoices") || hasRequiredClaims("View Attendances") || hasRequiredClaims("Accept & Reject Documents") ? <li className="menu-title">
                <span>Report Management</span>
              </li> : ""}

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View Attendances") ? <li className={pathname.includes('attendance-report') || pathname.includes('attendance-report') ? "active" : ""}>
                <Link to="/app/reports/attendance-reports" onClick={() => onMenuClik()}><i className="la la-calendar-check-o" /> <span>Timesheet </span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" || user.role === "Administrator" ? <li className={pathname.includes('shift-report') || pathname.includes('shift-report') ? "active" : ""}>
                <Link to="/app/reports/shift-reports" onClick={() => onMenuClik()}><i className="la la-calendar-check-o" /> <span>Shift Attendance </span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("View Progress Report") ? <li className={pathname.includes('progress-report') || pathname.includes('progress-report') ? "active" : ""}>
                <Link to="/app/reports/progress-reports" onClick={() => onMenuClik()}><i className="la la-folder-open" /> <span>Progress Notes</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || hasRequiredClaims("Load Invoices") ? <li className={pathname.includes('invoice') || pathname.includes('invoice') ? "active" : ""}>
                <Link to="/app/reports/invoice" onClick={() => onMenuClik()}><i className="la la-file-text" /> <span>Invoicing</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" ? <li className={pathname.includes('administrator-report') || pathname.includes('administrator-report') ? "active" : ""}>
                <Link to="/app/reports/administrator-reports" onClick={() => onMenuClik()}><i className="la la-calendar-check-o" /> <span>Admin Daily Notes</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" ? <li className={pathname.includes('staff-report') || pathname.includes('staff-report') ? "active" : ""}>
                <Link to="/app/reports/staff-reports" onClick={() => onMenuClik()}><i className="la la-calendar-check-o" /> <span>Staff Daily Notes</span></Link>
              </li> : ""}


              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Accept & Reject Documents") ? <li className={pathname.includes('document') || pathname.includes('document') ? "active" : ""}>
                <Link to="/app/employee/document" onClick={() => onMenuClik()}><i className="la la-book" /> <span>Documents</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || user.role === "Administrator" || hasRequiredClaims("Registrar") ? <li className={pathname.includes('registrar') || pathname.includes('registrar') ? "active" : ""}>
                <Link to="/app/employee/registrar" onClick={() => onMenuClik()}><i className="la la-outdent" /> <span>Registrar</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || user.role === "Administrator" ? <li className="menu-title">
                <span>Communication</span>
              </li> : ""}
              {user.role === "CompanyAdmin" || user.role === "Administrator" ? <li className={pathname.includes('message') || pathname.includes('message') ? "active" : ""}>
                <Link to="/app/message/inbox" onClick={() => onMenuClik()}><i className="la la-comment" /> <span>Messages</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" || user.role === "Administrator" ? <li className="submenu">
                <a href="#" className={isSideMenu == "support" ? "subdrop" : ""} onClick={(e) => {
                  e.preventDefault();
                  toggleSidebar(isSideMenu == "support" ? "" : "support")
                }}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                {isSideMenu == "support" ?
                  <ul>
                    <li><Link className={pathname.includes('view-tickets') ? "active" : pathname.includes('view-tickets')}
                      to="/app/support/view-tickets" onClick={() => onMenuClik()}>View Tickets</Link>
                    </li>

                    <li><Link className={pathname.includes('raise-ticket') ? "active" : pathname.includes('raise-ticket')}
                      to="/app/support/raise-ticket" onClick={() => onMenuClik()}>Raise a Ticket</Link>
                    </li>

                    <li><Link className={pathname.includes('knowledge-base') ? "active" : pathname.includes('knowledge-base')}
                      to="/app/support/knowledge-base" onClick={() => onMenuClik()}>Knowledge Base</Link>
                    </li>

                  </ul>
                  : ""
                }
              </li> : ""}

              {user.role === "Staff" ? <li className="menu-title">
                <span>Communication</span>
              </li> : ""}

              {user.role === "Staff" ? <li className={pathname.includes('messageInbox') || pathname.includes('messageInbox') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/staff/staff/messageInbox"><i className="la la-comment" /> <span>Messages</span></Link>
              </li> : ""}

              {user.role === "Staff" ? <li className="submenu">
                <a href="#" className={isSideMenu == "support" ? "subdrop" : ""} onClick={(e) => {
                  e.preventDefault()
                  toggleSidebar(isSideMenu == "support" ? "" : "support")
                }}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                {isSideMenu == "support" ?
                  <ul>
                    <li><Link onClick={() => onMenuClik()} className={pathname.includes('view-ticket') ? "active" : pathname.includes('view-ticket') ?
                      "active" : pathname.includes('view-ticket') ? "active" : ""}
                      to="/staff/staff/view-ticket">View Tickets</Link>
                    </li>

                    <li><Link onClick={() => onMenuClik()} className={pathname.includes('raise-ticket') ? "active" : pathname.includes('raise-ticket') ?
                      "active" : pathname.includes('raise-ticket') ? "active" : ""}
                      to="/staff/staff/raise-ticket">Raise a Ticket</Link>
                    </li>

                    <li><Link onClick={() => onMenuClik()} className={pathname.includes('knowledge') ? "active" : pathname.includes('knowledge') ?
                      "active" : pathname.includes('knowledge') ? "active" : ""}
                      to="/staff/staff/knowledge">Knowledge Base</Link>
                    </li>

                  </ul>
                  : ""
                }
              </li> : ""}


              {/* Staff SideBar Ends */}



              {/* Client SideBar */}
              {user.role === "Client" ? <li className={pathname.includes('dashboard') ? "active" : ""} onClick={() => onMenuClik()}>

                <Link to="/client/app/dashboard"  >
                  <i className="la la-dashboard" />
                  <span> Dashboard</span></Link>

              </li> : ""}

              {user.role === "Client" ? <li className="menu-title">
                <span>Account Management</span>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-profile') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-profile"><i className="la la-user" /> <span>Profile</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('change-password') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/change-password"><i className="la la-lock" /> <span>Change Password</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className="menu-title">
                <span>Client Management</span>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-roster') || pathname.includes('client-roster') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-roster"><i className="la la-calendar" /> <span>Shift Roster</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-rep') || pathname.includes('client-rep') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-rep"><i className="la la-rub" /> <span>Representatives</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-disability') || pathname.includes('client-disability') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-disability"><i className="la la-wheelchair" /> <span>Disability Support Needs</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-aid-equip') || pathname.includes('client-aid-equip') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-aid-equip"><i className="la la-eraser" /> <span>Aids & Equipments</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-daily-living') || pathname.includes('client-daily-living') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-daily-living"><i className="la la-sun-o" /> <span>Daily Living & Night Support</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-health') || pathname.includes('client-health') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-health"><i className="la la-yelp" /> <span>Health Support Needs</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-behaviuor') || pathname.includes('client-behaviuor') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-behaviuor"><i className="la la-bell-o" /> <span>Behaviour Support Needs</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-community') || pathname.includes('client-community') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-community"><i className="la la-bank" /> <span>Community Support Needs</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('privacy-statement') || pathname.includes('privacy-statement') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/privacy-statement"><i className="la la-check-circle-o" /> <span>Privacy Statement</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-document') || pathname.includes('client-document') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-document"><i className="la la-book" /> <span>Documents</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className="menu-title">
                <span>Communication</span>
              </li> : ""}

              {user.role === "Client" ? <li className={pathname.includes('client-message') || pathname.includes('client-message') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/client/app/client-message"><i className="la la-comment" /> <span>Messages</span></Link>
              </li> : ""}

              {user.role === "Client" ? <li className="submenu">
                <a href="#" className={isSideMenu == "support" ? "subdrop" : ""} onClick={(e) => {
                  e.preventDefault()
                  toggleSidebar(isSideMenu == "support" ? "" : "support")
                }}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                {isSideMenu == "support" ?
                  <ul>
                    <li><Link onClick={() => onMenuClik()} className={pathname.includes('client-view_ticket') ? "active" : pathname.includes('client-view_ticket') ?
                      "active" : pathname.includes('client-view_ticket') ? "active" : ""}
                      to="/client/app/client-view_ticket">View Tickets</Link>
                    </li>

                    <li><Link onClick={() => onMenuClik()} className={pathname.includes('client-raise_ticket') ? "active" : pathname.includes('client-raise_ticket') ?
                      "active" : pathname.includes('client-raise_ticket') ? "active" : ""}
                      to="/client/app/client-raise_ticket">Raise a Ticket</Link>
                    </li>

                    <li><Link onClick={() => onMenuClik()} className={pathname.includes('client-knowledge_base') ? "active" : pathname.includes('client-knowledge_base') ?
                      "active" : pathname.includes('client-knowledge_base') ? "active" : ""}
                      to="/client/app/client-knowledge_base">Knowledge Base</Link>
                    </li>

                  </ul>
                  : ""
                }



              </li> : ""}




              {/* 
              <div className='p-4'>

                <button className='btn btn-outline-danger btn-sm' onClick={() => emptyCache()}>
                  Clear Cache
                </button>
              </div> */}



              <br />
              <br />
            </ul>
          </div>
        </div>


      </Scrollbars>


    </div>

  );

}

export default withRouter(Sidebar);

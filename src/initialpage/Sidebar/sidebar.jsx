import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { MdDashboard } from 'react-icons/md';

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

  // const claims = JSON.parse(localStorage.getItem('claims'));
  // console.log(claims);
  // const claimType = claims.map((claim) => claim.value);
  // console.log(claimType);

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
              {
                user.role === "CompanyAdmin" ? <li className={pathname.includes('dashboard') ? "active" : ""} onClick={() => onMenuClik()}>

                  <Link to="/app/main/dashboard"  >
                    <i className="la la-dashboard" />
                    <span> Dashboard</span></Link>



                </li> : ""
              }
              {/* Staff Dashboard */}
              {
                user.role === "Staff" || hasRequiredClaims("Staff Dashboard") ? <li className={pathname.includes('dashboard') ? "active" : ""} onClick={() => onMenuClik()}>

                  <Link to="/staff/staff/dashboard"  >
                    <i className="la la-dashboard" />
                    <span> Dashboard</span></Link>

                </li> : ""
              }



              {user.role === "CompanyAdmin" || hasRequiredClaims("Add & Edit Role") || hasRequiredClaims("View Administrator") || hasRequiredClaims("View Staff") || hasRequiredClaims("View Client") ? <li className="menu-title">
                <span>User Management</span>
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("Add & Edit Role") ? <li className="submenu">
                <a href="#" className={isSideMenu == "management" ? "subdrop" : ""} onClick={(e) => {
                  e.preventDefault();
                  toggleSidebar(isSideMenu == "management" ? "" : "management")
                }}><i className="la la-cog" /> <span>Account Management</span> <span className="menu-arrow" /></a>
                {isSideMenu == "management" ?
                  <ul>
                    {user.role === "CompanyAdmin" || hasRequiredClaims("Account Users") ? <li><Link className={pathname.includes('alluser') ? "active" : pathname.includes('alluser')}
                      onClick={() => onMenuClik()}
                      to="/app/account/alluser" >Manage Users</Link> </li> : ""}
                    {user.role === "CompanyAdmin" || hasRequiredClaims("Add & Edit Role") ? <li><Link className={pathname.includes('user-roles') ? "active" : pathname.includes('user-roles')}
                      onClick={() => onMenuClik()}
                      to="/app/account/user-roles" >Manage Roles</Link> </li> : ""}
                  </ul>
                  : ""
                }
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("View Administrator") ? <li className={pathname.includes('admin') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/app/employee/alladmin"><i className="la la-user-lock" /> <span>Administrators</span></Link>
              </li> : ""}



              {user.role === "CompanyAdmin" || hasRequiredClaims("View Staff") ?

                <li className={pathname.includes('allstaff') ? "active" : ""} onClick={() => onMenuClik()}>
                  <Link to="/app/employee/allstaff">
                    <i className="la la-user" />
                    <span>Staffs</span>
                  </Link>
                </li>
                : ""

              }

              {/* {user.role === "CompanyAdmin" || (
                <HasClaim claimType="View Staff">
                  <li className={pathname.includes('allstaff') ? "active" : ""} onClick={() => onMenuClick()}>
                    <Link to="/app/employee/allstaff">
                      <i className="la la-user" />
                      <span>Staffs</span>
                    </Link>
                  </li>
                </HasClaim>
              )} */}

              {user.role === "CompanyAdmin" || hasRequiredClaims("View Client") ? <li className={pathname.includes('clients') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/app/employee/clients"><i className="la la-users" /> <span>Clients</span></Link>
              </li> : ""}

              {/* Staff SideBar Starts */}
              {user.role === "Staff" ? <li className="menu-title">
                <span>Account Management</span>
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

              {user.role === "Staff" ? <li className="menu-title">
                <span>Staff-Client Management</span>
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

              {user.role === "CompanyAdmin" || hasRequiredClaims("View & Assign Admin Roster") ? <li className="menu-title">

                <span>Rostering Management</span>
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("Add & Delete Public Holiday") || hasRequiredClaims("Add, Edit & Delete Support of Schedule") || hasRequiredClaims("Support Coordinator") ? <li className="submenu">
                <a href="#" className={isSideMenu == "setup" ? "subdrop" : ""} onClick={(e) => {
                  e.preventDefault();
                  toggleSidebar(isSideMenu == "setup" ? "" : "setup")
                }}><i className="la la-map" /> <span>Set Up</span> <span className="menu-arrow" /></a>
                {isSideMenu == "setup" ?
                  <ul>


                    {user.role === "CompanyAdmin" || hasRequiredClaims("Add & Delete Public Holiday") || hasRequiredClaims("Add, Edit & Delete Support of Schedule") ?
                      <li><Link className={pathname.includes('public-holiday') ? "active" : pathname.includes('public-holiday')}




                        to="/app/setup/public-holiday" onClick={() => onMenuClik()}>Public Holidays</Link>
                      </li> : ""}

                    {user.role === "CompanyAdmin" || hasRequiredClaims("Add, Edit & Delete Support of Schedule") ? <li><Link className={pathname.includes('schedule-support') ? "active" : pathname.includes('schedule-support')}
                      to="/app/setup/schedule-support" onClick={() => onMenuClik()}>Schedule Supports</Link>
                    </li> : ""}

                    {user.role === "CompanyAdmin" || hasRequiredClaims("Support Coordinator") ? <li><Link className={pathname.includes('support-type') ? "active" : pathname.includes('support-type')}
                      to="/app/setup/support-type" onClick={() => onMenuClik()}>Support Type</Link>
                    </li> : ""}
                    {user.role === "CompanyAdmin" ? <li><Link className={pathname.includes('form-template') ? "active" : pathname.includes('form-template')}
                      to="/app/setup/form-template" onClick={() => onMenuClik()}>Form Templates</Link>
                    </li> : ""}
                    {user.role === "CompanyAdmin" || hasRequiredClaims("Third Party Integration") ? <li><Link className={pathname.includes('integrations') ? "active" : pathname.includes('integrations')}
                      to="/app/setup/integrations" onClick={() => onMenuClik()}>Third Party Integration</Link>
                    </li> : ""}

                  </ul>
                  : ""
                }
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("View & Assign Admin Roster") ? <li className={pathname.includes('shift-scheduling') || pathname.includes('shift-list') ? "active" : ""}>
                <Link to="/app/employee/shift-scheduling" onClick={() => onMenuClik()}><i className="la la-calendar" /> <span>Shift Roster</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" || hasRequiredClaims("View Progress Report") || hasRequiredClaims("Load Invoices") || hasRequiredClaims("View Attendances") || hasRequiredClaims("Accept & Reject Documents") ? <li className="menu-title">
                <span>Report Management</span>
              </li> : ""}

              {user.role === "CompanyAdmin" || hasRequiredClaims("View Attendances") ? <li className={pathname.includes('attendance-report') || pathname.includes('attendance-report') ? "active" : ""}>
                <Link to="/app/reports/attendance-reports" onClick={() => onMenuClik()}><i className="la la-calendar-check-o" /> <span>Attendance Report</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("View Progress Report") ? <li className={pathname.includes('progress-report') || pathname.includes('progress-report') ? "active" : ""}>
                <Link to="/app/reports/progress-reports" onClick={() => onMenuClik()}><i className="la la-folder-open" /> <span>Progress Report</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("Load Invoices") ? <li className={pathname.includes('invoice') || pathname.includes('invoice') ? "active" : ""}>
                <Link to="/app/reports/invoice" onClick={() => onMenuClik()}><i className="la la-file-text" /> <span>Invoicing</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" || hasRequiredClaims("Accept & Reject Documents") ? <li className={pathname.includes('document') || pathname.includes('document') ? "active" : ""}>
                <Link to="/app/employee/document" onClick={() => onMenuClik()}><i className="la la-book" /> <span>Documents</span></Link>
              </li> : ""}

              {user.role === "CompanyAdmin" ? <li className="menu-title">
                <span>Communication</span>
              </li> : ""}
              {user.role === "CompanyAdmin" ? <li className={pathname.includes('message') || pathname.includes('message') ? "active" : ""}>
                <Link to="/app/message/inbox" onClick={() => onMenuClik()}><i className="la la-comment" /> <span>Messages</span></Link>
              </li> : ""}
              {user.role === "CompanyAdmin" ? <li className="submenu">
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

              {/* {user.role === "Staff" ? <li className="menu-title">
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
              </li> : ""} */}


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

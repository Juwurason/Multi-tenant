import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { MdDashboard } from 'react-icons/md';

const AdminSidebar = (props) => {
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
    console.log(value);
    setSideMenu(value);
    setSideMenuNew(value);

  }

  const toggleLvelTwo = (value) => {
    setLevel2Menu(value)
  }
  const toggleLevelThree = (value) => {
    setLevel3Menu(value)
  }




  let pathname = props.location.pathname
  return (
    <div id="sidebar" className="sidebar" style={{ backgroundColor: "#1C75B9" }}>
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
          <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#1C75B9", height: '100vh' }}>


            { /*Vertical Sidebar starts here*/}
            <ul className="sidebar-vertical" id='veritical-sidebar'>
              <li className="menu-title">
                <span>Main</span>
              </li>
              <li className={pathname.includes('dashboard') ? "active" : ""} onClick={() => onMenuClik()}>

                <Link to="/administrator/administrator/adminDashboard">
                  <i className="la la-dashboard" />
                  <span> Dashboard</span></Link>



              </li>

              <li className="menu-title">
                <span>User Management</span>
              </li>

              <li className={pathname.includes('allStaff') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/administrator/allStaff"><i className="la la-user" /> <span>Staffs</span></Link>
              </li>
              <li className={pathname.includes('allClient') ? "active" : ""} onClick={() => onMenuClik()}>
                <Link to="/administrator/allClient"><i className="la la-users" /> <span>Clients</span></Link>
              </li>
              <li className="submenu">
                <a href="javascript:void(0)" className={isSideMenu == "management" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "management" ? "" : "management")}><i className="la la-cog" /> <span>Account Management</span> <span className="menu-arrow" /></a>
                {isSideMenu == "management" ?
                  <ul>
                    <li><Link className={pathname.includes('allUsers') ? "active" : pathname.includes('allUsers')}
                      onClick={() => onMenuClik()}
                      to="/administrator/allUsers" >Manage Users</Link> </li>

                    <li><Link className={pathname.includes('referrals') ? "active" : pathname.includes('referrals')}
                      onClick={() => onMenuClik()}
                      to="/administrator/referrals" >Referrals</Link> </li>
                    
                  </ul>
                  : ""
                }
              </li>
              <li className="menu-title">
                <span>Staff-Client Management</span>
              </li>
              <li className="submenu">
                <a href="javascript:void(0)" className={isSideMenu == "setup" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "setup" ? "" : "setup")}><i className="la la-map" /> <span>Set Up</span> <span className="menu-arrow" /></a>
                {isSideMenu == "setup" ?
                  <ul>
                    <li><Link className={pathname.includes('publicHoliday') ? "active" : pathname.includes('publicHoliday')}
                      to="/administrator/publicHoliday" onClick={() => onMenuClik()}>Public Holidays</Link>
                    </li>

                    <li><Link className={pathname.includes('scheduleSupport') ? "active" : pathname.includes('scheduleSupport')}
                      to="/administrator/scheduleSupport" onClick={() => onMenuClik()}>Schedule Supports</Link>
                    </li>

                    <li><Link className={pathname.includes('supportType') ? "active" : pathname.includes('supportType')}
                      to="/administrator/supportType" onClick={() => onMenuClik()}>Support Type</Link>
                    </li>

                  </ul>
                  : ""
                }
              </li>
              <li className={pathname.includes('shiftRoster') || pathname.includes('shiftRoster') ? "active" : ""}>
                <Link to="/administrator/shiftRoster" onClick={() => onMenuClik()}><i className="la la-calendar" /> <span>Shift Roaster</span></Link>
              </li>

              <li className="menu-title">
                <span>Report Management</span>
              </li>

              <li className={pathname.includes('attendanceReport') || pathname.includes('attendanceReport') ? "active" : ""}>
                <Link to="/administrator/attendanceReport" onClick={() => onMenuClik()}><i className="la la-calendar-check-o" /> <span>Attendance Report</span></Link>
              </li>
              <li className={pathname.includes('progressReport') || pathname.includes('progressReport') ? "active" : ""}>
                <Link to="/administrator/progressReport" onClick={() => onMenuClik()}><i className="la la-folder-open" /> <span>Progress Report</span></Link>
              </li>
         
              {/* <li className={pathname.includes('document') || pathname.includes('document') ? "active" : ""}>
                <Link to="/app/employee/document" onClick={() => onMenuClik()}><i className="la la-book" /> <span>Documents</span></Link>
              </li> */}

              <li className="menu-title">
                <span>Communication</span>
              </li>
              <li className={pathname.includes('messageInbox') || pathname.includes('messageInbox') ? "active" : ""}>
                <Link to="/administrator/messageInbox" onClick={() => onMenuClik()}><i className="la la-comment" /> <span>Messages</span></Link>
              </li>
              <li className="submenu">
                <a href="javascript:void(0)" className={isSideMenu == "support" ? "subdrop" : ""} onClick={() => toggleSidebar(isSideMenu == "support" ? "" : "support")}><i className="la la-headphones" /> <span>Support</span> <span className="menu-arrow" /></a>
                {isSideMenu == "support" ?
                  <ul>
                    <li><Link className={pathname.includes('viewTickets') ? "active" : pathname.includes('viewTickets')}
                      to="/administrator/viewTickets" onClick={() => onMenuClik()}>View Tickets</Link>
                    </li>

                    <li><Link className={pathname.includes('raiseTicket') ? "active" : pathname.includes('raiseTicket')}
                      to="/administrator/raiseTicket" onClick={() => onMenuClik()}>Raise a Ticket</Link>
                    </li>

                    <li><Link className={pathname.includes('knowledge') ? "active" : pathname.includes('knowledge')}
                      to="/administrator/knowledge" onClick={() => onMenuClik()}>Knowledge Base</Link>
                    </li>

                  </ul>
                  : ""
                }
              </li>

              <br />
              <br />
            </ul>
          </div>
        </div>


      </Scrollbars>


    </div>

  );

}

export default withRouter(AdminSidebar);

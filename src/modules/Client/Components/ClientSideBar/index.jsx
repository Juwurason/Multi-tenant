import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { MdDashboard } from 'react-icons/md';

const ClientSidebar = (props) => {
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
        // console.log(value);
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
        <div id="sidebar" className="sidebar" style={{ backgroundColor: "#405189" }}>
            <Scrollbars
                autoHide
                autoHeight
                autoHeightMin={0}
                autoHeightMax="95vh"
                thumbMinSize={30}
                universal={false}
                hideTracksWhenNotNeeded={true}


            >
                <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu" style={{ backgroundColor: "#405189", height: '100vh' }}>


                        { /*Vertical Sidebar starts here*/}
                        <ul className="sidebar-vertical" id='veritical-sidebar'>










                            <br />
                            <br />
                        </ul>
                    </div>
                </div>


            </Scrollbars>


        </div>

    );

}

export default withRouter(ClientSidebar);

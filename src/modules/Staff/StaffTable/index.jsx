import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './styles.css';
import Offcanvas from '../../../Entryfile/offcanvance';

const StaffTable = () => {

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    { date: new Date("2023-04-04"), title: "Event 1", color: "blue" },
    { date: new Date("2023-03-04"), title: "Event 2", color: "green" },
    { date: new Date("2023-03-30"), title: "Event 3", color: "red" },
    { date: new Date("2023-03-30"), title: "Event 4", color: "purple" },
    { date: new Date("2023-03-30"), title: "Event 5", color: "orange" },
  ]);  
  

  const handleDateClick = (value) => {
    setDate(value);
  };

  const formatEvents = (events) => {
    return events.map((event) => ({
      title: event.title,
      start: new Date(event.date),
      backgroundColor: event.color
    }));
  };

  const eventRender = (info) => {
    info.el.style.backgroundColor = info.event.backgroundColor;
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div
        className="fc-event-title-container"
        style={{ backgroundColor: eventInfo.event.backgroundColor }}
      >
        <span className="fc-event-title">{eventInfo.event.title}</span>
      </div>
    );
  };

  const today = new Date();
  const todayEvents = events.filter(event => 
    event.date === `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Shift &amp; Roster</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">

          <div className="AppointmentsCalendar">
            <h1>Events Calendar</h1>
            <div className="calendar-wrapper">
              <FullCalendar 
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={formatEvents(todayEvents)}
                eventRender={eventRender}
                eventLimit={4}
                eventContent={renderEventContent}
              />
            </div>
            {todayEvents.length > 4 && (
              <div className="see-more-wrapper">
                <Link to="/">See more</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Offcanvas />
    </>
  );
}

export default StaffTable;

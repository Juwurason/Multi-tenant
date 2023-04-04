
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Offcanvas from '../../../Entryfile/offcanvance';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const StaffRoster = () => {
      
    useEffect( ()=>{
      if($('.select').length > 0) {
        $('.select').select2({
          minimumResultsForSearch: -1,
          width: '100%'
        });
      }
    });  

    const [events, setEvents] = useState([]);
    const calendarRef = useRef(null);
    const [eventTitle, setEventTitle] = useState('');
  
    const handleEventDrop = ({ event }) => {
      const updatedEvent = {
        ...event.toPlainObject(),
        start: event.start.toISOString(),
        end: event.end.toISOString(),
      };
      
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
      );
    };
  
    const handleEventClick = (info) => {
      setEventTitle(info.event.title);
    };

    useEffect(() => {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setEvents([
        { id: 1, title: 'meeting', start: formattedDate + 'T12:01:00', end: formattedDate + 'T14:00:00' },
        { id: 2, title: 'Event 2', start: formattedDate + 'T12:00:00', end: formattedDate + 'T14:00:00' },
        { id: 3, title: 'Event 3', start: formattedDate + 'T12:00:00', end: formattedDate + 'T14:00:00' }
      ]);
    }, []);

    const eventContent = (arg) => {
      const eventTitle = arg.event.title;
      const dayEl = arg.dayEl;
      const eventsOnThisDay = dayEl ? dayEl.querySelectorAll('.fc-daygrid-event') : [];
    
      let size = '1.2em';
      let backgroundColor = '#5cb85c';
      let color = '#FFFFFF';
      let borderRadius = '4px';
      let padding = '5px';
      let eventClassNames = 'fc-daygrid-event-inset-border fc-daygrid-event-rounded';
    
      if (eventTitle.length > '20') {
        size = '0.8em';
      }
      if (eventTitle.length > '30') {
        size = '0.6em';
      }
      if (arg.event.id === '1') {
        backgroundColor = '#C8102E';
      } else if (arg.event.id === '2') {
        backgroundColor = '#FFC600';
      }
    
      // Display only the first 4 events
      if (eventsOnThisDay.length > '4' && eventsOnThisDay.indexOf(arg.el) > '3') {
        return null;
      }
    
      // Display a "see more" button when there are more than 4 events
      if (eventsOnThisDay.length > '4' && eventsOnThisDay.indexOf(arg.el) === '3') {
        return (
          <>
            <div
              className={eventClassNames}
              style={{fontSize: size, backgroundColor: backgroundColor, color: color, borderRadius: borderRadius, padding: padding }}>
                {arg.timeText} - {eventTitle}
            </div>
            <div className="fc-daygrid-event-more">
              <a href="#">See more</a>
            </div>
          </>
        );
      }
      return (
        <>
          <div
            className={eventClassNames}
            style={{fontSize: size, backgroundColor: backgroundColor, color: color, borderRadius: borderRadius, padding: padding }}>
              {arg.timeText} - {eventTitle}
          </div>
        </>
      );
    };
    

  
      return ( 
        <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
            <Helmet>
                <title>Shift &amp; Roster</title>
                <meta name="description" content="Login page"/>					
            </Helmet>
          {/* Page Content */}
          <div className="content container-fluid">

          <div className="AppointmentsCalendar">
          <FullCalendar
        ref={calendarRef}
        // plugins={[dayGridPlugin, interactionPlugin]}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
       initialView="dayGridMonth"
        editable={true}
        eventDrop={handleEventDrop}
        eventContent={eventContent}
        events={events}
        eventClick={handleEventClick}
        views={{
          month: { buttonText: 'Month' }
        }}
        // eventClick={(info) => {
        //   alert('Appointment Title: ' + info.event.title);
        // }}
        selectable={true}
      />
        {eventTitle && <p>{eventTitle}</p>}
    </div>
          </div>
        </div>
        {/* /Edit Schedule Modal */}
        <Offcanvas/>
      </>
        );
   
}

export default StaffRoster;

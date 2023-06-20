

import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import EditProgressNote from './EditProgressNote';
import ProgressNote from './ProgressNote';
import StaffDashboard from './StaffDashboard';
import StaffDocument from './StaffDocument';
import StaffEditProfile from './StaffEditProfile';
import StaffChangePassword from './StaffForgettingPassword';
import StaffProgressNote from './StaffProgressNote';
import StaffRoster from './StaffRoster';
import StaffTable from './StaffTable';
import RaiseTicket from './Support/raiseTicket';
import ViewTicket from './Support/viewTicket';
import TicketDetails from './Support/ticketDetails';
import KnowledgeBase from './Support/knowledgeBase';
import StaffForm from './StaffForm';
import MessageInbox from './Message';
import StaffAttendanceReport from './StaffAttendanceReport';
import StaffAttendanceDetails from './StaffAttendanceDetails';
import StaffDailyReport from './StaffDailyReport';
import StaffNewReport from './StaffNewReport';
import StaffProfile from './StaffProfile';
import StaffAttendance from './StaffAttendance';
import AddReport from './AddReport';
import useHttp from '../../hooks/useHttp';
import { toast } from 'react-toastify';
import CreateProgressNote from './CreateProgressNote';





const StaffRoute = ({ match }) => {

  const { get } = useHttp();
  const staffProfile = JSON.parse(localStorage.getItem('staffProfile'));
  const id = JSON.parse(localStorage.getItem('user'));
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffOne, setStaffOne] = useState({});
  const [staffAvail, setStaffAvail] = useState([]);
  const [staffAtten, setStaffAttendance] = useState([]);
  const [staffPro, setStaffPro] = useState([]);
  const [staffDocument, setStaffDocument] = useState([]);
  const [options, setOptions] = useState([]);
  const [sentEmail, setSentEmail] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [ticket, setTicket] = useState([]);

  const FetchData = async () => {
    setLoading(true)
    try {
      const { data } = await get(`/ShiftRosters/get_shifts_by_user?client=&staff=${staffProfile.staffId}`, { cacheTimeout: 300000 });
      setStaff(data.shiftRoster);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`/Staffs/${staffProfile.staffId}`, { cacheTimeout: 300000 })
      setStaffOne(data)
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`StaffAvailibilities/get_staff_availabilities?staffId=${staffProfile.staffId}`, { cacheTimeout: 300000 });
      setStaffAvail(data)
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`/Attendances/get_staff_attendances?staffId=${staffProfile.staffId}`, { cacheTimeout: 300000 })
      setStaffAttendance(data)
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`/ProgressNotes/get_progressnote_by_user?staffname=${staffProfile.fullName}&profileId=`, { cacheTimeout: 300000 })
      setStaffPro(data.progressNote);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`/Documents/get_all_staff_documents?staffId=${staffProfile.staffId}`, { cacheTimeout: 300000 })
      setStaffDocument(data.staffDocuments)
      setLoading(false)

    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`/Account/get_all_users?companyId=${id.companyId}`, { cacheTimeout: 300000 });
      const formattedOptions = data.map((item) => ({
        label: item.email,
        value: item.email,
      }));
      setOptions(formattedOptions);
      setLoading(false)
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
    }
    try {
      const { data } = await get(`/Messages/sent?userId=${id.userId}`, { cacheTimeout: 300000 });
      setSentEmail(data.message);
      setLoading(false)
      // console.log(data);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }
    try {
      const { data } = await get(`/Messages/get_all_message?userId=${id.userId}`, { cacheTimeout: 300000 });
      setInbox(data.message);
      setLoading(false)
      // console.log(data);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    try {
      const { data } = await get(`/Tickets/get_user_tickets?userId=${id.userId}`, { cacheTimeout: 300000 });
      setTicket(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false)
    }

    finally {
      setLoading(false)
    }


  };
  useEffect(() => {
    FetchData()
  }, []);



  return (
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
      <Route
        path={`${match.url}/dashboard`}
        render={() => <StaffDashboard roster={staff} loading={loading} />} />
      <Route path={`${match.url}/document`}
        render={() => <StaffDocument staffDocument={staffDocument} FetchData={FetchData} />} />
      <Route path={`${match.url}/progressNote`}
        render={() => <StaffProgressNote staffPro={staffPro} FetchData={FetchData} />} />
      <Route path={`${match.url}/progress/:uid`} render={() => <ProgressNote />} />
      <Route path={`${match.url}/create-progress/:uid`} render={() => <CreateProgressNote />} />
      <Route path={`${match.url}/edit-progress/:uid/:pro`} render={() => <EditProgressNote />} />
      <Route path={`${match.url}/table`} render={() => <StaffTable />} />
      <Route path={`${match.url}/profile`}
        render={() => <StaffProfile staffOne={staffOne} FetchData={FetchData} />} />
      <Route path={`${match.url}/edit-profile`} render={() => <StaffEditProfile />} />
      <Route path={`${match.url}/changepassword`} render={() => <StaffChangePassword />} />
      <Route path={`${match.url}/attendance`}
        render={() => <StaffAttendance staffAtten={staffAtten} />} />
      <Route path={`${match.url}/roster`}
        render={() => <StaffRoster staff={staff} loading={loading} />} />
      <Route path={`${match.url}/report/:uid`} render={() => <AddReport />} />
      <Route path={`${match.url}/view-ticket`} 
      render={() => <ViewTicket ticket={ticket} FetchData={FetchData} />} />
      <Route path={`${match.url}/raise-ticket`} render={() => <RaiseTicket />} />
      <Route path={`${match.url}/ticket-details/:uid`} render={() => <TicketDetails />} />
      <Route path={`${match.url}/knowledge`} render={() => <KnowledgeBase />} />
      <Route path={`${match.url}/form`}
        render={() => <StaffForm staffAvail={staffAvail} FetchData={FetchData} />} />
      <Route path={`${match.url}/messageInbox`}
        render={() => <MessageInbox
          options={options} sentEmail={sentEmail} inbox={inbox} FetchData={FetchData} />} />
      <Route path={`${match.url}/attendance-report/:uid`} render={() => <StaffAttendanceReport />} />
      <Route path={`${match.url}/attendance-details/:uid`} render={() => <StaffAttendanceDetails />} />
      <Route path={`${match.url}/daily-report`} render={() => <StaffDailyReport />} />
      <Route path={`${match.url}/new-report`} render={() => <StaffNewReport />} />

    </Switch>
  )
};

export default StaffRoute;
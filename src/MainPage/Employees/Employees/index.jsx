
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AllEmployees from './allemployees';
import Department from './department';
import Timesheet from './timesheet';
import ShiftScheduling from './shiftscheduling';
import Document from './document';
import Refferal from './refferals';
import AllAdmin from './Admin';
import AddStaff from '../../../_components/forms/AddStaff';
import AddAdministrator from '../../../_components/forms/AddAdmin';
import AddShiftRoaster from '../../../_components/forms/AddShiftRoaster';
import EditShiftRoaster from '../../../_components/forms/EditShiftRoaster';
import useHttp from '../../../hooks/useHttp';
import Clients from './clients';
import AddClients from '../../../_components/forms/AddClients';

const EmployeesRoute = ({ match }) => {
   const id = JSON.parse(localStorage.getItem('user'));
   const { get } = useHttp();
   const [admin, setAdmin] = useState([]);
   const [staff, setStaff] = useState([]);
   const [clients, setClients] = useState([]);
   const [schedule, setSchedule] = useState([]);
   const [document, setDocument] = useState([]);
   const [loading, setLoading] = useState(false);

   const FetchData = async () => {
      setLoading(true)

      try {
         const staffResponse = await get(`Staffs?companyId=${id.companyId}`, { cacheTimeout: 300000 });
         const staff = staffResponse.data;
         setStaff(staff);
         setLoading(false);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
      try {
         const clientResponse = await get(`/Profiles?companyId=${id.companyId}`, { cacheTimeout: 300000 });
         const client = clientResponse.data;
         setClients(client);
         setLoading(false)
      } catch (error) {
         console.log(error);
         setLoading(false)
      } finally {
         setLoading(false)
      }
      try {
         const scheduleResponse = await get(`/ShiftRosters/get_all_shift_rosters?companyId=${id.companyId}`, { cacheTimeout: 300000 });
         const schedule = scheduleResponse.data;
         setSchedule(schedule);
         setLoading(false)
      } catch (error) {
         console.log(error);
      }
      try {
         const documentResponse = await get(`/Documents/get_all_documents?companyId=${id.companyId}`, { cacheTimeout: 300000 });
         const document = documentResponse.data;
         setDocument(document);
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   };
   useEffect(() => {

      FetchData()
   }, []);

   return (
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/allemployees`} />
         <Route
            path={`${match.url}/alladmin`} component={AllAdmin} />
         <Route
            path={`${match.url}/allstaff`}
            component={AllEmployees}
         />
         <Route
            path={`${match.url}/clients`}
            component={Clients}
         />
         <Route
            path={`${match.url}/document`}
            component={Document}
         />

         <Route path={`${match.url}/addclients`} component={AddClients} />

         <Route path={`${match.url}/addadmin`} component={AddAdministrator} />
         <Route path={`${match.url}/addstaff`} component={AddStaff} />
         <Route path={`${match.url}/refferals`} component={Refferal} />
         <Route path={`${match.url}/departments`} component={Department} />
         <Route path={`${match.url}/timesheet`} component={Timesheet} />
         <Route
            path={`${match.url}/shift-scheduling`}
            render={() => <ShiftScheduling staff={staff} clients={clients} FetchData={FetchData}
               loading={loading} schedule={schedule} setSchedule={setSchedule} />}
         />
         <Route
            path={`${match.url}/add-shift`}
            render={() => <AddShiftRoaster staff={staff} clients={clients}
            />}
         />

         <Route path={`${match.url}/edit-shift/:uid`} component={EditShiftRoaster} />
      </Switch>
   )
};

export default EmployeesRoute;

import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { useCompanyContext } from '../../../context';
import useHttp from '../../../hooks/useHttp';

const StaffEditProfile = () => {

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [profile, setProfile] = useState([])
  const privateHttp = useHttp()

  const handleNext = (e) => {
    e.preventDefault()
    setStep(step + 1);
  }

  const handlePrev = (e) => {
    e.preventDefault()
    setStep(step - 1);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(33);
    // TODO: handle form submission
  }

  const {staffProfile} = useCompanyContext()
 

  const renderStep1 = () => {

    return (
      <div>
        <h4 className="card-title">Personal Information</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="form-control" value={staffProfile.firstName} readOnly onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="number" className="form-control" value={lastName} onChange={(event) => setPhoneNumber(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="number" className="form-control" value={staffProfile.phoneNumber} readOnly onChange={(event) => setPhoneNumber(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Date Of Birth</label>
              <input type="date" className="form-control" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
            </div>

          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Surname</label>
              <input type="text" className="form-control" value={staffProfile.surName} readOnly onChange={(event) => setDateOfBirth(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" className="form-control" value={staffProfile.email} readOnly onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="form-group">
              <label className="d-block">Gender:</label>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="gender" id="gender_male" value="Male" checked={gender === 'Male'} onChange={(event) => setGender(event.target.value)} />
                <label className="form-check-label" htmlFor="gender_male">Male</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="gender" id="gender_female" value="Female" checked={gender === 'Female'} onChange={(event) => setGender(event.target.value)} />
                <label className="form-check-label" htmlFor="gender_female">Female</label>
              </div>
            </div>
            <div className="form-group">
              <label>About Me</label><br />
              <textarea name="" id="" cols="43" rows="3"></textarea>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const renderStep2 = () => {
    return (
      <div>
        <h4 className="card-title">Postal Address</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Address Line 1</label>
              <input type="text" className="form-control" value={staffProfile.address} readOnly />
            </div>
            <div className="form-group">
              <label>Address Line 2</label>
              <input type="text" className="form-control" value={addressLine2} onChange={(event) => setAddressLine2(event.target.value)} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="form-control" value={state} onChange={(event) => setState(event.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>City</label>
              <input type="text" className="form-control" value={city} onChange={(event) => setCity(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" className="form-control" value={country} onChange={(event) => setCountry(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" className="form-control" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStep3 = () => {
    return (
      <div>
         <h4 className="card-title">Bank information</h4>
                         <div className="row">
                           <div className="col-md-6">
                             <div className="form-group">
                               <label>Account Name</label>
                               <input type="text" className="form-control" value={accountName} onChange={(event) => setAccountName(event.target.value)} />
                             </div>
                           
                             <div className="form-group">
                               <label>Bank Name</label>
                               <input type="text" className="form-control" value={bankName} onChange={(event) => setBankName(event.target.value)} />
                             </div>
                           </div>
                           <div className="col-md-6">
                           <div className="form-group">
                               <label>Account Number</label>
                               <input type="text" className="form-control" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
                             </div>
                         
                           </div>
                         </div>
      </div>
    );
  }

  return (
    <div className="container container-fluid page-wrapper">
      <Helmet>
        <title>Edit Staff Profile</title>
        <meta name="description" content="Edit Page" />
      </Helmet>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Edit Profile - Step {step}</h4>
            </div>
            <div className="card-body">
              <form>
                {step === 1 && renderStep1()} 
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                <div className="mt-3">
                  {step > 1 && <button className="btn btn-primary mr-2" onClick={handlePrev}>Previous</button>}
                  {step < 3 ? <button className="btn btn-primary" onClick={handleNext}>Next</button> : <button className="btn btn-success" type="submit" onClick={handleSubmit}>Save</button>}
                  <Link to="/staff/staffprofile" className="btn btn-link">Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default StaffEditProfile;
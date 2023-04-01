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
  const [branch, setBranch] = useState('');
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
  const [emeName, setEmeName] = useState('')
  const [emeState, setEmeState] = useState('')
  const [emeEmail, setEmeEmail] = useState('')
  const [emePostCode, setEmePostCode] = useState('')
  const [emeAddress, setEmeAddress] = useState('')
  const [emeCountry, setEmeCountry] = useState('')
  const [emeCity, setEmeCity] = useState('')
  const [emeSuburb, setEmeSuburb] = useState('')
  const [emePhoneNumber, setEmePhoneNumber] = useState('')
  const [relationship, setRelationship] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [bsb, setBsb] = useState('')


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

  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))

  useEffect(()=>{
    const fetchProfile = async () => {
      try {
          const response = await privateHttp.get(`/Staffs/${getStaffProfile.staffId}`)
          setProfile(response.data)
          console.log(response.data);
      } catch (error) {
          console.log(error);
      }
  }
  fetchProfile()
  },[])
  const handleSubmi = async (e) => {
    e.preventDefault()
    if (documentName === "" ||  expire === "" || document === "")
     {
      return toast.error("Input Fields cannot be empty")
    }

   const formData = new FormData()
    formData.append("firstName", getStaffProfile.firstName);
    formData.append("email", getStaffProfile.email);
    formData.append("phoneNumber", getStaffProfile.phoneNumber);
    formData.append("surName", getStaffProfile.surName);
    formData.append("middleName", lastName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("aboutMe", aboutMe);
    formData.append("address", addressLine2);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("postcode", postalCode);
    formData.append("accountName", accountName);
    formData.append("accountNumber", accountNumber);
    formData.append("bankName", bankName);
    formData.append("branch", branch);
    formData.append("bsb", bsb);
    formData.append("suburb", emeSuburb);
    formData.append("nextOfKin", emeName);
    formData.append("kinAddress", emeAddress);
    formData.append("kinCity", emeCity);
    formData.append("kinCountry", emeCountry);
    formData.append("kinEmail", emeEmail);
    formData.append("kinPhoneNumber", emePhoneNumber);
    formData.append("kinPostcode", emePostCode);
    formData.append("kinState", emeState);
    formData.append("relationship", relationship);

    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/document_upload?userId=${id.userId}`,
        formData

      )
      // console.log(data);
      toast.success(data.message)

      setLoading(false)

    } catch (error) {
      console.log(error);
      toast.error(data.error)
      setLoading(false);

    }
    finally{
        setLoading(false)
    }
}

  const renderStep1 = () => {

    return (
      <div>
        <h4 className="card-title">Personal Information</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="form-control" value={getStaffProfile.firstName} readOnly />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="number" className="form-control" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="number" className="form-control" value={getStaffProfile.phoneNumber} readOnly />
            </div>
            <div className="form-group">
              <label>Date Of Birth</label>
              <input type="date" className="form-control" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
            </div>

          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Surname</label>
              <input type="text" className="form-control" value={getStaffProfile.surName} readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" className="form-control" value={getStaffProfile.email} readOnly />
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
              <textarea name="" id="" cols="43" rows="3" value={aboutMe} onChange={(event) => setAboutMe(event.target.value)}></textarea>
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
              <input type="text" className="form-control" value={getStaffProfile.address} readOnly />
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
            <div className="form-group">
              <label>BSB</label>
              <input type="text" className="form-control" value={bsb} onChange={(event) => setBsb(event.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Account Number</label>
              <input type="text" className="form-control" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input type="text" className="form-control" value={branch} onChange={(event) => setBranch(event.target.value)} />
            </div>

          </div>
        </div>
      </div>
    );
  }

  const renderStep4 = () => {
    return (
      <div>
        <h4 className="card-title">Emergency Contact</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Emergency Contact FullName</label>
              <input type="text" className="form-control" value={emeName} onChange={(event) => setEmeName(event.target.value)} />
            </div>

            <div className="form-group">
              <label>Relationship</label>
              <input type="text" className="form-control" value={relationship} onChange={(event) => setRelationship(event.target.value)} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="form-control" value={emeState} onChange={(event) => setEmeState(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" value={emeEmail} onChange={(event) => setEmeEmail(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Post Code</label>
              <input type="email" className="form-control" value={emePostCode} onChange={(event) => setEmePostCode(event.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="form-control" value={emeAddress} onChange={(event) => setEmeAddress(event.target.value)} />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input type="text" className="form-control" value={emeCountry} onChange={(event) => setEmeCountry(event.target.value)} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" className="form-control" value={emeCity} onChange={(event) => setEmeCity(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="email" className="form-control" value={emePhoneNumber} onChange={(event) => setEmePhoneNumber(event.target.value)} />
            </div>
            <div className="form-group">
              <label>Suburb</label>
              <input type="email" className="form-control" value={emeSuburb} onChange={(event) => setEmeSuburb(event.target.value)} />
            </div>

          </div>
        </div>
      </div>
    );
  }

  const renderStep5 = () => {
    return (
      <div>
        <h4 className="card-title">Other Information</h4>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Instagram</label>
              <input type="text" className="form-control" placeholder='https://WWW......' value={accountName} onChange={(event) => setAccountName(event.target.value)} />
            </div>

            <div className="form-group">
              <label>Facebook</label>
              <input type="text" className="form-control" placeholder='https://WWW......' value={bankName} onChange={(event) => setBankName(event.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Twitter</label>
              <input type="text" className="form-control" placeholder='https://WWW......' value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="text" className="form-control" placeholder='https://WWW......' value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
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
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                <div className="mt-3">
                  {step > 1 && <button className="btn btn-primary mr-2" onClick={handlePrev}>Previous</button>}
                  {step < 5 ? <button style={{marginLeft:'10px'}} className="btn btn-primary" onClick={handleNext}>Next</button> : <button className="btn btn-success" type="submit" onClick={handleSubmit}>Save</button>}
                  <Link to="/staff/staffprofile" style={{marginLeft:'10px'}}><button className="btn btn-primary"> Cancel </button></Link>
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
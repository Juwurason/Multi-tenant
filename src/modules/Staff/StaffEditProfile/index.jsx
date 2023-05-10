import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'
import man from "../../../assets/img/man.png"
import useHttp from '../../../hooks/useHttp';
import { toast } from "react-toastify";

const StaffEditProfile = () => {

  const [profile, setProfile] = useState({})
  const [editedProfile, setEditedProfile] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')

  const privateHttp = useHttp()
  const getStaffProfile = JSON.parse(localStorage.getItem('staffProfile'))

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await privateHttp.get(`/Staffs/${getStaffProfile.staffId}`, { cacheTimeout: 300000 })
        setProfile(response.data)
        setEditedProfile(response.data)
        // console.log(response.data);

      } catch (error) {
        console.log(error);
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%'
      });
    }
  });

  const styles = {
    main: {
      backgroundColor: 'black',
      display: 'none',

    },
    label: {
      width: '130px',
      height: '130px',
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex", justifyContent: "center", alignItems: "center", textAlign: 'center'
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    setStep(step + 1);
  }

  const handlePrev = (e) => {
    e.preventDefault()
    setStep(step - 1);
  }

  function handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    const newValue = value === "" ? "" : value;
    setEditedProfile({
      ...editedProfile,
      [name]: newValue
    });
  }

  const id = JSON.parse(localStorage.getItem('user'))

  const handleSave = async (e) => {
    e.preventDefault()
    // if (documentName === "" ||  expire === "" || document === "")
    //  {
    //   return toast.error("Input Fields cannot be empty")
    // }

    const formData = new FormData()
    formData.append("CompanyId", id.companyId);
    formData.append("StaffId", getStaffProfile.staffId);
    formData.append("firstName", profile.firstName);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("surName", profile.surName);
    formData.append("middleName", editedProfile.middleName);
    formData.append("gender", editedProfile.gender);
    formData.append("dateOfBirth", editedProfile.dateOfBirth);
    formData.append("aboutMe", editedProfile.aboutMe);
    formData.append("address", profile.address);
    formData.append("city", editedProfile.city);
    formData.append("country", editedProfile.country);
    formData.append("state", editedProfile.state);
    formData.append("postcode", editedProfile.postalCode);
    formData.append("accountName", editedProfile.accountName);
    formData.append("accountNumber", editedProfile.accountNumber);
    formData.append("bankName", editedProfile.bankName);
    formData.append("branch", editedProfile.branch);
    formData.append("bsb", editedProfile.bsb);
    formData.append("suburb", editedProfile.kinSuburb);
    formData.append("nextOfKin", editedProfile.kinName);
    formData.append("kinAddress", editedProfile.kinAddress);
    formData.append("kinCity", editedProfile.kinCity);
    formData.append("kinCountry", editedProfile.kinCountry);
    formData.append("kinEmail", editedProfile.kinEmail);
    formData.append("kinPhoneNumber", editedProfile.kinPhoneNumber);
    formData.append("kinPostcode", editedProfile.kinPostCode);
    formData.append("kinState", editedProfile.kinState);
    formData.append("relationship", editedProfile.relationship);
    formData.append("imageFile", editedProfile.image);
    formData.append("twitter", editedProfile.tweet);
    formData.append("linkedIn", editedProfile.linkd);
    formData.append("instagram", editedProfile.insta);
    formData.append("facebook", editedProfile.fbook);

    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Staffs/edit/${getStaffProfile.staffId}?userId=${id.userId}`,
        formData
      )
      // console.log(data);
      if (data.status === 'Success') {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      setLoading(false)

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      toast.error(error.response.data.title)
      setLoading(false);

    }
    finally {
      setLoading(false)
    }
  }

  const handlechange = (e) => {
    setImage(e.target.files[0]);
  }
  const renderStep1 = () => {

    return (
      <div>
        <h4 className="card-title">Personal Information</h4>

        <div className="row">
          <div style={{ display: "flex", justifyContent: 'center' }}>
            <div className="form-group">
              <label style={styles.label} className="border border-2 rounded-circle">
                <img className="rounded-circle" style={{ width: '100%', height: '100%' }}
                  src={image === "" ? man : URL.createObjectURL(image)} alt="profile image" />
              </label>

              <label style={{ display: 'flex', justifyContent: 'center' }}>
                <FaCamera />
                <input type="file" accept="image/jpeg, image/png" required style={styles.main} onChange={handlechange} />
              </label>

            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="form-control" value={profile.firstName} readOnly />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" className="form-control" name="middleName" value={editedProfile.middleName || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="number" className="form-control" value={profile.phoneNumber} readOnly />
            </div>
            <div className="form-group">
              <label>Date Of Birth</label>
              <input type="date" name='dateOfBirth' className="form-control" value={editedProfile.dateOfBirth || ''} onChange={handleInputChange} />
            </div>

          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Surname</label>
              <input type="text" className="form-control" value={profile.surName} onChange={handleInputChange} readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" className="form-control" value={profile.email} readOnly />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select className="form-control" name="gender" value={editedProfile.gender || ''} onChange={handleInputChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>About Me</label><br />
              <textarea className='form-control' name="aboutMe" id="" style={{ width: "100%", height: "auto" }} value={editedProfile.aboutMe || ''} onChange={handleInputChange}></textarea>
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
              <input type="text" className="form-control" value={profile.address} readOnly />
            </div>
            <div className="form-group">
              <label>Address Line 2</label>
              <input type="text" className="form-control" name='address' value={editedProfile.address || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="form-control" name='state' value={editedProfile.state || ''} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>City</label>
              <input type="text" className="form-control" name='city' value={editedProfile.city || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" className="form-control" name='country' value={editedProfile.country || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" className="form-control" name='postalCode' value={editedProfile.postalCode || ''} onChange={handleInputChange} />
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
              <input type="text" className="form-control" name='AccountName' value={editedProfile.AccountName || ''} onChange={handleInputChange} />
            </div>

            <div className="form-group">

              <label>Bank Name</label>
              {editedProfile.bankName === "" ?
                <input type="text" className="form-control" name='bankName' value={editedProfile.bankName || ''} onChange={handleInputChange} />
                :
                <input type="text" className="form-control" name='bankName' value={editedProfile.bankName || ''} onChange={handleInputChange} readOnly />

              }
            </div>
            <div className="form-group">
              <label>BSB</label>
              <input type="text" className="form-control" name='bsb' value={editedProfile.bsb || ''} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Account Number</label>
              {editedProfile.accountNumber === "" ?
                <input type="text" className="form-control" name='bankName' value={editedProfile.accountNumber || ''} onChange={handleInputChange} />
                :
                <input type="text" className="form-control" name='bankName' value={editedProfile.accountNumber || ''} onChange={handleInputChange} readOnly />

              }
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input type="text" className="form-control" name='branch' value={editedProfile.branch || ''} onChange={handleInputChange} />
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
              <input type="text" className="form-control" name='kinName' value={editedProfile.kinName || ''} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Relationship</label>
              <input type="text" className="form-control" name='relationship' value={editedProfile.relationship || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="form-control" name='kinState' value={editedProfile.kinState || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" name='kinEmail' value={editedProfile.kinEmail || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Post Code</label>
              <input type="email" className="form-control" name='kinPostCode' value={editedProfile.kinPostCode || ''} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="form-control" name='kinAddress' value={editedProfile.kinAddress || ''} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input type="text" className="form-control" name='kinCountry' value={editedProfile.kinCountry || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" className="form-control" name='kinCity' value={editedProfile.kinCity || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="email" className="form-control" name='kinPhoneNumber' value={editedProfile.kinPhoneNumber || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Suburb</label>
              <input type="email" className="form-control" name='kinSuburb' value={editedProfile.kinSuburb || ''} onChange={handleInputChange} />
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
              <input type="text" className="form-control" placeholder='https://WWW......' name='insta' value={editedProfile.insta || ''} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Facebook</label>
              <input type="text" className="form-control" placeholder='https://WWW......' name='fbook' value={editedProfile.fbook || ''} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Twitter</label>
              <input type="text" className="form-control" placeholder='https://WWW......' name='tweet' value={editedProfile.tweet || ''} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="text" className="form-control" placeholder='https://WWW......' name='linkd' value={editedProfile.linkd || ''} onChange={handleInputChange} />
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
                  {step < 5 ? <button style={{ marginLeft: '10px' }} className="btn btn-primary" onClick={handleNext}>Next</button> :
                    <button style={{ marginLeft: '10px' }} disabled={loading ? true : false} className="btn btn-success" type="submit" onClick={handleSave}>
                      {loading ? <div className="spinner-grow text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div> : "Save"}
                    </button>}
                  <Link to="/staff/staffprofile" style={{ marginLeft: '10px' }}><button className="btn btn-danger"> Cancel </button></Link>
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
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import http from '../../api/http'
import { useCompanyContext } from '../../context';
import useHttp from '../../hooks/useHttp';

const AddClient = () => {
  const { userProfile } = useCompanyContext();
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('');
  const [surName, setSurName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreementStartDate, setAgreementStartDate] = useState('');
  const [agreementEndDate, setAgreementEndDate] = useState('');
  const [NDISNo, setNDISNo] = useState('');

  const privateHttp = useHttp();


  const submitForm = async (e) => {
    e.preventDefault()
    if (firstName.trim() === "" || surName.trim() === "" || middleName.trim() === "" || address.trim() === "" ||
      email.trim() === "" || agreementEndDate.trim() === "" || agreementStartDate.trim() === "" || NDISNo.trim() === ""
    ) {
      return toast.error("All Fields must be filled")
    }


    const formData = new FormData()
    // Add input field values to formData
    formData.append("CompanyId", 30);
    formData.append("FirstName", firstName);
    formData.append("SurName", surName);
    formData.append("MiddleName", middleName);
    formData.append("Address", address);
    formData.append("Email", email);
    formData.append("PhoneNumber", phoneNumber);
    formData.append("AgreementStartDate", agreementStartDate);
    formData.append("AgreementEndDate", agreementEndDate);
    formData.append("NDISNo", NDISNo);



    try {
      setLoading(true)
      const { data } = await privateHttp.post(`/Profiles/add_client?userId=${userProfile.userId}`,
        formData
      )
      toast.success(data.message)
      // navigate.push('/app/main/dashboard')
      setLoading(false)
      setFirstName('');
      setSurName('');
      setMiddleName('');
      setAddress('');
      setEmail('');
      setPhoneNumber('');
      setAgreementStartDate('');
      setAgreementEndDate('');
      setNDISNo('');
    } catch (error) {
      toast.error(error.response?.data?.message)
      console.log(error);
      setLoading(false)

    } finally {
      setLoading(false)
    }

  }

  return (
    <>
      {/* Add Employee Modal */}
      <div id="add_client" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div className="modal-content overflow-auto">
            <div className="modal-header">
              <h5 className="modal-title">Add Client</h5>
              <button type="button" className="close bg-primary" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitForm}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">First Name <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Surname <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" value={surName} onChange={e => setSurName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Middle Name </label>
                      <input className="form-control" type="text" value={middleName} onChange={e => setMiddleName(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Email <span className="text-danger">*</span></label>
                      <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone Number <span className="text-danger">*</span></label>
                      <input className="form-control" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Address <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Agreement start date <span className="text-danger">*</span></label>
                      <input className="form-control" type="date" value={agreementStartDate} onChange={e => setAgreementStartDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Agreement end date <span className="text-danger">*</span></label>
                      <input className="form-control" type="date" value={agreementEndDate} onChange={e => setAgreementEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">NDIS NO <span className="text-danger">*</span></label>
                      <input className="form-control" type="text" value={NDISNo} onChange={e => setNDISNo(e.target.value)} />
                    </div>
                  </div>



                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type='submit'>

                    {loading ? <div className="spinner-grow text-light" role="status">
                      <span className="sr-only">Loading...</span>
                    </div> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Employee Modal */}
    </>
  )
}

export default AddClient
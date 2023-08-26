import React, { useState } from 'react';

const StepTwo = () => {
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');

  const handleEmailChanged = (event) => {
    setEmail(event.target.value);
  };

  const handleEmailConfirmChanged = (event) => {
    setEmailConfirm(event.target.value);
  };

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <label>Your email</label>
          <input
            className="u-full-width required"
            placeholder="test@mailbox.com"
            type="email"
            onChange={handleEmailChanged}
            value={email}
            autoFocus
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <label>Confirm email</label>
          <input
            className="u-full-width"
            placeholder="Confirm email"
            type="email"
            onChange={handleEmailConfirmChanged}
            value={emailConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default StepTwo;

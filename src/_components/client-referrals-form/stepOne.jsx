import React, { useState } from 'react';

const StepOne = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleFirstNameChanged = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChanged = (event) => {
    setLastName(event.target.value);
  };

  return (
    <div>
      <div className="row">
        <div className="six columns">
          <label>First Name</label>
          <input
            className="u-full-width"
            placeholder="First Name"
            type="text"
            onChange={handleFirstNameChanged}
            value={firstName}
            autoFocus
          />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <label>Last Name</label>
          <input
            className="u-full-width"
            placeholder="Last Name"
            type="text"
            onChange={handleLastNameChanged}
            value={lastName}
          />
        </div>
      </div>
    </div>
  );
};

export default StepOne;

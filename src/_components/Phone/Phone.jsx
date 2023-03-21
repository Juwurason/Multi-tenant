import React from 'react';
import PhoneInput from 'react-phone-number-input'

const Phone = ({ value, setValue }) => {
    return (
        <PhoneInput
            defaultCountry='AU'
            international
            countryCallingCodeEditable={false}
            placeholder="Enter phone number"
            value={value}
            onChange={setValue}
            className='border-none form-contol'
        />

    );
}

export default Phone;
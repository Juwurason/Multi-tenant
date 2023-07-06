import React from 'react';
import useClaims from './useClaims';

const HasClaim = ({ claimType, children }) => {
  const claims = useClaims();
  const hasRequiredClaim = claims.some(claim => claim.value === claimType);
  const user = JSON.parse(localStorage.getItem('user'));

  const userHasClaim = hasRequiredClaim || user.role === "CompanyAdmin";

  return userHasClaim ? <>{children}</> : null;
};

export default HasClaim;

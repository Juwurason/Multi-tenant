import React, { useEffect, useState } from 'react';

const useClaims = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem('claims'));
    setClaims(storedClaims);
  }, []);

  return claims;
};

export default useClaims;

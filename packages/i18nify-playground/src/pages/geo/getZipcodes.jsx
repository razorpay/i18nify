import { useToast } from '@razorpay/blade/components';
import { getStates, getZipcodes } from '@razorpay/i18nify-js/geo';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Loader from 'src/components/Dashboard/Loader';
import GenericDropdown from 'src/components/Generic/GenericDropdown';
import withGeoHOC from 'src/pages/Geo/common/withGeoHOC';

function GetZipcodes({
  countryInp,
  setStateInp,
  setStateList,
  setCode,
  isLoading,
  stateInp,
}) {
  const [zipcodes, setZipcodes] = useState([]);
  const [zipcodeInp, setZipcodeInp] = useState(null);

  const toast = useToast();

  const { isPending: isPendingGetStates, mutate: getStatesApi } = useMutation({
    mutationFn: getStates,
    onError: () => {
      toast.show({ content: 'Error fetching states', color: 'negative' });
    },
    onSuccess: (res) => {
      const data = Object.keys(res).map((stateCode) => ({
        title: `${stateCode} - ${res[stateCode].name}`,
        value: stateCode,
      }));
      setStateList(data);
      setStateInp(data[0].value);
    },
  });

  const {
    data: zipCodesData,
    error,
    isLoading: isPendingGetZipCodes,
  } = useQuery({
    queryKey: ['zipcodes', countryInp, stateInp],
    queryFn: () => getZipcodes(countryInp, stateInp),
    enabled: Boolean(countryInp && stateInp),
  });

  useEffect(() => {
    if (error) {
      toast.show({ content: 'Error fetching zipcodes', color: 'negative' });
    }
  }, [error]);

  useEffect(() => {
    if (zipCodesData) {
      setZipcodes(
        zipCodesData.map((option) => ({ title: option, value: option })),
      );
      setZipcodeInp(zipCodesData[0]);
      setCode(JSON.stringify(zipCodesData, null, 2));
    }
  }, [zipCodesData]);

  useEffect(() => {
    setStateInp('');
    setStateList([]);
    setZipcodeInp('');
    setZipcodes([]);
    setCode('');
    getStatesApi(countryInp);
  }, [countryInp]);

  useEffect(() => {
    if (!stateInp) return;
    setZipcodeInp('');
    setZipcodes([]);
  }, [stateInp]);

  return (
    <>
      <GenericDropdown
        label="List of ZipCodes"
        list={zipcodes}
        isVirtualized
        value={zipcodeInp}
        onChange={(value) => setZipcodeInp(value)}
      />
      {(isPendingGetStates || isLoading || isPendingGetZipCodes) && <Loader />}
    </>
  );
}

export default withGeoHOC(GetZipcodes, {
  title: 'getZipcodes',
  description: `📮 Your essential utility for retrieving postal codes with precision! 🌍 Features include zipcode data retrieval with locale support and detailed metadata. 🔄 Perfect for apps needing postal code information, the function returns a complete list of zipcodes for any supported country and state combination. 💫 Includes support for various postal code formats and automatic validation. 🚀 Seamlessly integrates with the i18nify ecosystem for consistent zipcode data access across your application.`,
  stateDropdownLabel: 'Select state',
});

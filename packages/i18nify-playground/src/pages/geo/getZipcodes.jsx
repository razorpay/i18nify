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
  description: `Explore postal codes with the getZipcodes API! Discover a list of
      unique zip codes organized by country and state, making it easy to
      navigate geographic areas and streamline address-based operations.`,
  stateDropdownLabel: 'Select state',
});

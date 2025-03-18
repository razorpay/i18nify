import { useToast } from '@razorpay/blade/components';
import { getStates, getCities } from '@razorpay/i18nify-js/geo';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import Loader from 'src/components/Dashboard/Loader';
import GenericDropdown from 'src/components/Generic/GenericDropdown';
import withGeoHOC from 'src/pages/Geo/common/withGeoHOC';

function GetCities({
  countryInp,
  stateInp,
  setStateInp,
  setStateList,
  isLoading,
  setCode,
}) {
  const [cities, setCities] = useState([]);
  const [cityInp, setCityInp] = useState(null);

  const toast = useToast();

  const { isPending: isPendingGetStates, mutate: getStatesApi } = useMutation({
    mutationFn: (countryInp) => getStates(countryInp),
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
    data: citiesData,
    error,
    isLoading: isPendingCitiesApi,
  } = useQuery({
    queryKey: ['cities', countryInp, stateInp],
    queryFn: () => getCities(countryInp, stateInp),
    enabled: Boolean(countryInp && stateInp),
  });

  useEffect(() => {
    if (error) {
      toast.show({ content: 'Error fetching cities', color: 'negative' });
    }
  }, [error]);

  useEffect(() => {
    setStateInp('');
    setStateList([]);
    setCityInp('');
    setCities([]);
    setCode('');
    getStatesApi(countryInp);
  }, [countryInp]);

  useEffect(() => {
    setCityInp('');
    setCities([]);
  }, [stateInp, countryInp]);

  useEffect(() => {
    if (citiesData) {
      const data = citiesData?.map((option) => {
        return {
          title: option,
          value: option,
        };
      });
      setCities(data);
      setCityInp(data[0].value);
      setCode(JSON.stringify(citiesData, null, 2));
    }
  }, [citiesData]);

  return (
    <>
      <GenericDropdown
        label="Cities List"
        list={cities}
        value={cityInp}
        isVirtualized
        onChange={(city) => setCityInp(city)}
      />
      {(isLoading || isPendingGetStates || isPendingCitiesApi) && <Loader />}
    </>
  );
}

export default withGeoHOC(GetCities, {
  title: 'getCities',
  description: ` 🏙️ Ready to navigate cities with precision? Say hello to getCities!
      This ingenious function empowers you to explore cities based on
      country and state codes, unleashing a world of urban excitement at
      your fingertips. Whether you're hunting for the pulse of New York or
      the charm of Tokyo, just call this function and let the cityscape
      adventure begin! 🗺️🌆`,
  stateDropdownLabel: 'Select state',
});

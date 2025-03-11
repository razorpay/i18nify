import { useToast } from '@razorpay/blade/components';
import { getStates } from '@razorpay/i18nify-js/geo';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useEffect } from 'react';
import Loader from 'src/components/Dashboard/Loader';
import withGeoHOC from 'src/pages/Geo/common/withGeoHOC';

function GetStates({
  countryInp,
  setStateInp,
  setStateList,
  setCode,
  isLoading,
}) {
  const toast = useToast();

  const { isPending: isPendingGetStates, mutate: getStatesApi } = useMutation({
    mutationFn: getStates,
    onError: () => {
      toast.show({ content: 'Error fetching states', color: 'negative' });
    },
    onSuccess: (res) => {
      setCode(JSON.stringify(res, null, 2));

      const data = Object.keys(res).map((stateCode) => ({
        title: `${stateCode} - ${res[stateCode].name}`,
        value: stateCode,
      }));
      setStateList(data);
      setStateInp(data[0].value);
    },
  });

  useEffect(() => {
    setStateInp('');
    setStateList([]);

    getStatesApi(countryInp);
  }, [countryInp]);

  return (isLoading || isPendingGetStates) && <Loader />;
}

export default withGeoHOC(GetStates, {
  title: 'getStates',
  description: `🌍 Embark on a state-by-state discovery with the getStates API! Get
        access to a treasure trove of state information, including names,
        time zones, and even a list of vibrant cities within each state.`,
});

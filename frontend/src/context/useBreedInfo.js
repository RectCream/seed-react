import {useState, useEffect} from 'react';
import getBreedInfo from '../api/breedInfoApi';

const useBreedInfo = (initialQuery) => {
  const [query, setQuery] = useState(initialQuery);
  const [breedInfo, setBreedInfo] = useState({
    loading: true,
    hasError: false,
    data: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const breedInfoResponse = await getBreedInfo(query);
        setBreedInfo({
          loading: false,
          hasError: false,
          data: breedInfoResponse.data,
        });
      } catch (error) {
        console.log(error);
        setBreedInfo({
          loading: false,
          hasError: true,
          data: undefined,
        });
      }
    };
    fetchData();
  }, [query]);

  return [breedInfo, setQuery];
};

export {useBreedInfo};

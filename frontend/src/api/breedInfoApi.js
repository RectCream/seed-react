import API from './API';

const endpoint = `/breeds`;

const getBreedInfo = async (queryPara) => {
  const {vegeName} = queryPara;
  try {
    const response = await API.get(`${endpoint}/${vegeName}`);
    return response;
  } catch (error) {
    // TODO: map API error to frontend defined error
    throw Error('Error on fetching breed info.');
  }
};

export default getBreedInfo;

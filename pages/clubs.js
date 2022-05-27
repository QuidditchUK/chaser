import axios from 'axios';
import FindQuidditch from './find-quidditch';
import { getBasePageProps, getAllClubs, getClubs } from 'modules/prismic';
import { postcodeRegex } from 'modules/validations';

const validPostcode = (value) => value && value.match(postcodeRegex);

export const getServerSideProps = async ({ query }) => {
  const basePageProps = await getBasePageProps();

  if (!validPostcode(query.postcode)) {
    const clubs = await getAllClubs({
      showCommunity: true,
      showUniversity: true,
    });

    return {
      props: { clubs, ...basePageProps },
    };
  }

  const { data } = await axios.get(
    `https://api.postcodes.io/postcodes/${query.postcode}`
  );

  const clubs = await getClubs({
    longitude: data.result.longitude,
    latitude: data.result.latitude,
    distance: query.distance ?? 100,
    showCommunity: query.showCommunity,
    showUniversity: query.showUniversity,
  });

  return {
    props: { clubs, ...basePageProps },
  };
};

export default FindQuidditch;

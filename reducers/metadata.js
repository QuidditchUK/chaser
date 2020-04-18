import { METADATA_UPDATE } from '../constants/action-types';

const initialState = {
  description: 'The official source for Quidditch UK news, highlights, results and more',
  image: `${window.location.origin}/open-graph.png`,
  subTitle: 'Find Your Passion',
  title: 'QuidditchUK',
  type: 'website',
  url: `${window.location.origin}${window.location.pathname}`,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case METADATA_UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

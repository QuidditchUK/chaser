import { shade } from 'polished';

export const hoverStates = (color) => ({
  buttons: {
    'background-color': shade(0.3, color),
    'border-color': shade(0.3, color),
  },
});

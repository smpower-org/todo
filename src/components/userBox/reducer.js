import { TOGGLE_USERBOX_STAUS } from './actionTypes';

export default (state = {isUserboxExtended: false}, action) => {
  switch(action.type) {
    case TOGGLE_USERBOX_STAUS:
      return { ...state, isUserboxExtended: !state.isUserboxExtended };
    default:
      return state;
  }
};


import { CHANGE_VIEW } from '../actions/types';

const INITIAL_STATE = {
  previousView: '/',
  currentView: null
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CHANGE_VIEW:
      return { ...state, previousView: state.currentView, currentView: action.payload };
    default:
      return state;
  }
};
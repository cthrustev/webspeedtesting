import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import auditReducer from './auditReducer';
import viewReducer from './viewReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  audit: auditReducer,
  view: viewReducer
})
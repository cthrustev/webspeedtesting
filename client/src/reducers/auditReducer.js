import { NEW_AUDIT, OLD_AUDIT, PAST_AUDITS, CLEAR_PAST, RESET_AUDIT } from '../actions/types';

const INITIAL_STATE = {
  auditData: {},
  isAuditSuccess: null,
  isAuditReady: false,
  isOldAudit: false,
  pastAudits: []
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case NEW_AUDIT:
      return {
        ...state,
        auditData: action.payload.auditData,
        isAuditSuccess: action.payload.isAuditSuccess,
        isAuditReady: action.payload.isAuditReady
      };
    case OLD_AUDIT:
      return {
        ...state,
        auditData: action.payload.auditData,
        isAuditSuccess: action.payload.isAuditSuccess,
        isAuditReady: action.payload.isAuditReady,
        isOldAudit: action.payload.isOldAudit
      }
    case PAST_AUDITS:
      return {
        ...state,
        pastAudits: action.payload.pastAudits
      }
    case CLEAR_PAST: 
      return {
        ...state,
        pastAudits: action.payload.pastAudits
      }
    case RESET_AUDIT:
      return { 
        ...state,
        auditData: action.payload.auditData,
        isAuditSuccess: action.payload.isAuditSuccess,
        isAuditReady: action.payload.isAuditReady,
        isOldAudit: action.payload.isOldAudit
      };
    default:
      return state;
  }
};
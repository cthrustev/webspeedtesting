import { SIGN_IN, SIGN_OUT, NEW_AUDIT, OLD_AUDIT, PAST_AUDITS, CLEAR_PAST, RESET_AUDIT, CHANGE_VIEW } from './types';

//Authentication actions
export const signIn = (userId, name) => {
  return {
    type: SIGN_IN,
    payload: {
      userId,
    }
  }
};

export const signOut = () => {
  return {
    type: SIGN_OUT
  }
};

//Audit results actions
export const newAudit = (auditData) => {
  return {
    type: NEW_AUDIT,
    payload: {
      auditData: auditData.auditResults,
      isAuditSuccess: true,
      isAuditReady: true
    }
  }
};

//Get past audits to store
export const pastAudits = (audits) => {
  return {
    type: PAST_AUDITS,
    payload: {
      pastAudits: audits
    }
  }
}

//Clear past audits
export const clearPast = () => {
  return {
    type: CLEAR_PAST,
    payload: {
      pastAudits: []
    }
  }
}

export const oldAudit = (auditData) => {
  return {
    type: OLD_AUDIT,
    payload: {
      auditData: auditData,
      isAuditSuccess: true,
      isAuditReady: true,
      isOldAudit: true
    }
  }
}

//Reset audit data in redux store
export const resetAudit = () => {
  return {
    type: RESET_AUDIT,
    payload: {
      auditData: {},
      isAuditSuccess: null,
      isAuditReady: false
    }
  }
}

//Change view
export const changeView = (view) => {
  return {
    type: CHANGE_VIEW,
    payload: view
  }
}
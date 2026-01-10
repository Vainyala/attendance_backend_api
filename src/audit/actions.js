// src/audit/actions.js

// Authentication & Session
const LOGIN_ATTEMPT = 'login_attempt';
const LOGIN_SUCCESS = 'login_success';
const LOGIN_FAILURE = 'login_failure';
const JWT_VALIDATED = 'jwt_validated';
const JWT_INVALID = 'jwt_invalid';
const LOGOUT = 'logout';
const SESSION_CREATED = 'session_created';
const SESSION_DEACTIVATED = 'session_deactivated';

// Organization Management
const ORG_CREATE = 'org_create';
const ORG_UPDATE = 'org_update';
const ORG_DELETE = 'org_delete';
const ORG_VIEW = 'org_view';

// Project Management
const PROJECT_CREATE = 'project_create';
const PROJECT_UPDATE = 'project_update';
const PROJECT_DELETE = 'project_delete';
const PROJECT_VIEW = 'project_view';

// User Management
const USER_CREATE = 'user_create';
const USER_UPDATE = 'user_update';
const USER_DELETE = 'user_delete';
const PASSWORD_CHANGE = 'password_change';
const STATUS_CHANGE = 'status_change';

// System & Compliance
const CONFIG_UPDATE = 'config_update';
const ROLE_ASSIGNED = 'role_assigned';
const ROLE_REVOKED = 'role_revoked';
const AUDIT_EXPORT = 'audit_export';
const ERROR_LOGGED = 'error_logged';
const HEALTH_CHECK = 'health_check'; // ✅ new dedicated action

module.exports = {
  // Auth & Session
  LOGIN_ATTEMPT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  JWT_VALIDATED,
  JWT_INVALID,
  LOGOUT,
  SESSION_CREATED,
  SESSION_DEACTIVATED,

  // Organization
  ORG_CREATE,
  ORG_UPDATE,
  ORG_DELETE,
  ORG_VIEW,

  // Project
  PROJECT_CREATE,
  PROJECT_UPDATE,
  PROJECT_DELETE,
  PROJECT_VIEW,

  // User
  USER_CREATE,
  USER_UPDATE,
  USER_DELETE,
  PASSWORD_CHANGE,
  STATUS_CHANGE,

  // System
  CONFIG_UPDATE,
  ROLE_ASSIGNED,
  ROLE_REVOKED,
  AUDIT_EXPORT,
  ERROR_LOGGED,
  HEALTH_CHECK
};

module.exports = {
  MISSING_ACTION_ERROR: 'Missing mandatory actionName parameter from options.',
  MISSING_ACTIVATION_ID_ERROR: 'Missing mandatory activation parameter from options.',
  MISSING_ACTION_BODY_ERROR: 'Missing mandatory action parameter from options.',
  MISSING_NAMESPACE_ERROR: 'Missing namespace from options, please set a default namespace or pass one in the options.',
  INVOKE_TIMEOUT_ERROR: 'Action invocation timed out before completing.',
  CREATE_CONFLICT_ERROR: 'Action already exists with this name but overwrite flag was false.',
  INVALID_AUTH_ERROR: 'OpenWhisk authentication failed, check API key?',
  MISSING_URL_ERROR: 'Invalid URL for API called, OpenWhisk returned HTTP 404 response.',
  API_SYSTEM_ERROR: 'API call failed, response contained error code.'
}

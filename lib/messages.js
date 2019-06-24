// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

module.exports = {
  MISSING_FEED_NAME_ERROR: 'Missing mandatory feedName or id parameters from options.',
  MISSING_FEED_TRIGGER_ERROR: 'Missing mandatory trigger parameter from options.',
  MISSING_ACTION_ERROR: 'Missing mandatory actionName parameter from options.',
  INVALID_ACTION_ERROR: 'Invalid actionName parameter from options. Should be "action", "/namespace/action" or "/namespace/package/action".',
  INVALID_RESOURCE_ERROR: 'Invalid resource identifier from options. Should be "resource", "/namespace/resource" or "/namespace/package/resource".',
  INVALID_SEQ_PARAMETER: 'Invalid sequence parameter from options. Must be an array.',
  INVALID_SEQ_PARAMETER_LENGTH: 'Invalid sequence parameter from options. Array must not be empty.',
  INVALID_ACTION_AND_SEQ_PARAMETERS: 'Invalid options parameters, contains both "action" and "sequence" parameters in options.',
  MISSING_ACTION_OR_SEQ_BODY_ERROR: 'Missing mandatory action or sequence parameter from options.',
  MISSING_RULE_ERROR: 'Missing mandatory ruleName parameter from options.',
  MISSING_TRIGGER_ERROR: 'Missing mandatory triggerName parameter from options.',
  MISSING_PACKAGE_ERROR: 'Missing mandatory packageName parameter from options.',
  MISSING_ACTIVATION_ID_ERROR: 'Missing mandatory activation parameter from options.',
  MISSING_RULE_ACTION_ERROR: 'Missing mandatory action parameter from options.',
  MISSING_RULE_TRIGGER_ERROR: 'Missing mandatory trigger parameter from options.',
  MISSING_TRIGGER_BODY_ERROR: 'Missing mandatory trigger parameter from options.',
  MISSING_PACKAGE_BODY_ERROR: 'Missing mandatory package parameter from options.',
  MISSING_NAMESPACE_ERROR: 'Missing namespace from options, please set a default namespace or pass one in the options.',
  INVALID_OPTIONS_ERROR: 'Invalid constructor options.',
  MISSING_BASEPATH_ERROR: 'Missing mandatory parameters: basepath or name.',
  INVALID_BASEPATH_ERROR: 'Invalid parameters: use basepath or name, not both.'
}

<!--
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
-->

# Changelog

## v3.21.1

* Fix version in package.json and package-lock.json
* Update npm ignores.

## v3.21.0

* Allow clients to override API mappings for the Route operations (#201)
* Handle a blocking/result response that is demoted to async (#199)
* Fix handling of request exceptions in client.js (#196)
* Allow update to action without requiring a code artifact (#195)

## v3.20.0

* Removed all references to Incubator now Apache OpenWhisk has passed incubation (#190, #192)
* Add proxy agent to be included by runtime, rather than building in (#175)
* Re-worked CI/CD setup (#180)

## v3.19.0-incubating

* Initial release as an Apache Incubator project.
* Add support for using HTTP Proxy with library (#147)
* Allow users to set API version for platform API (#151)
* Allow users to provide own client certificate and key in configuration (#152)

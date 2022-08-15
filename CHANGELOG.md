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

## v3.21.7
Update dependencies

## v3.21.6

fix: Do not modify input params. (#231)

## v3.21.5

Support client retries (#227)
Adding missing properties to Exec TS defs (#225)

## v3.21.4

Adding missing main property to Exec type (#222)
chore: Fix spelling errors (#219)
Add concurrency to the limits map to allow the client to request conrrency limits (#218)

## v3.21.3

* Relax action kind typing (#215)

## v3.21.2

* Allow custom headers (#209)
* Propagate __OW_TRANSACTION_ID if present (#208)

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

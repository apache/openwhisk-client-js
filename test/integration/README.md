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
Integrations Test
--

Running the integration tests requires the following environment variables to be defined.

    export __OW_API_KEY=<your api key>
    export __OW_API_HOST=<openwhisk API hostname>
    export __OW_NAMESPACE=<openwhisk namespace>
    export __OW_APIGW_TOKEN=<api gateway token>

You can retrieve these settings from the `.wskprops` file.

*Note:* If the tests fail, you might need to remove the created artifacts manually.

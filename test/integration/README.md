Integrations Test
--

Running the integration tests requires the following environment variables to be defined.

    export __OW_API_KEY=<your api key>
    export __OW_API_HOST=<openwhisk API hostname>
    export __OW_NAMESPACE=<openwhisk namespace>
    export __OW_APIGW_TOKEN=<api gateway token>

You can retrieve these settings from the `.wskprops` file.

*Note:* If the tests fail, you might need to remove the created artifacts manually.

[Alternatively](https://github.com/apache/incubator-openwhisk-client-js#integration-tests), you can run the `prepIntegrationTests.sh` script using guest credentials or by specifying specific credentials.  

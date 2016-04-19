Integrations Test
--

Running the integration tests requires the following environment variables to be defined.

    export OW_API_KEY=<your api key>
    export OW_API_HOST=<openwhisk host>
    export OW_NAMESPACE=<namespace to test against>

You can retrieve these settings using the `wsk` CLI:

    wsk property get --all

Further, you need to create the following seed artifacts.

Action
---
* Name: hello 

function main() {
   return {payload: 'Hello world'};
}

Action
---
* Name: tests 

function main() {
   return {payload: 'Hello world'};
}

Trigger
---
* Name: sample


If you have the `wsk` CLI installed, you may create the required actions and trigger as follows:

    wsk action  create hello action.js
    wsk action  create tests action.js
    wsk trigger create sample

where `action.js` contains the `main` function shown above.

*Note:* If the tests fail, the cleanup code does not currently run. You will need to remove the created artifacts manually.

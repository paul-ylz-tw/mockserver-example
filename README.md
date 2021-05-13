# MockServer Example

This repository demonstrates a naive example of using [mockserver](https://www.mock-server.com/) to do integration
testing. The use-case is where a system may have both an API server and a background worker. The API server puts jobs in
a queue for the background worker. The background worker operates on a separate process, doing so without blocking
requests on the API. It may do time-consuming actions such as making calls to an external service.

When integration-testing, making un-mocked calls to any external services is a recipe for pain. The external service
should always be mocked if we want test outcomes to be within our control.

A tool like `mock-server` is helpful because it provides a convenient API to set up expectations on the mocked external
service, and then verify them - all from within the test suite.

## Running the integration test

```bash
docker-compose up
```

## Thanks to the team for all the help, inspiration and motivation to keep work meaningful during these crazy times.

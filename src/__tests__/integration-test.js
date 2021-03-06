const axios = require("axios");
const {mockServerClient} = require("mockserver-client");
const mockServer = mockServerClient(
    process.env.EXTERNAL_SERVICE_HOST,
    process.env.EXTERNAL_SERVICE_PORT);
const sutHost = process.env.SERVER_HOST;
const sutPort = process.env.SERVER_PORT;

describe("creating a job", () => {
    beforeEach(() => {
        mockServer.reset();

        /*
         * Sets up mockserver to return 200 with a requestID to any
         * POST /process request
         */
        return mockServer.mockAnyResponse({
            httpRequest: {
                method: "POST",
                path: "/process"
            },
            httpResponse: {
                body: {
                    requestID: "0000-1111"
                },
                statusCode: 200
            }
        }).
            then(
                () => {
                    console.log("mockserver expectation created");
                },
                (error) => {
                    console.log(error);
                }
            );
    })

    it("makes a request to the external service", async () => {

        // make a request to the system under test
        const res = await axios.post(`http://${sutHost}:${sutPort}/messages`, {
            fact: "hippos are herbivores"
        })

        expect(res.status).
            toEqual(200);
        expect(res.data.message).
            toEqual("Job added to queue");

        // give a few moments for the worker to receive the job and call
        // the external service
        await sleep(3000);

        // verify that the external service was called as expected
        await mockServer.verify({
            body: {
                fact: "hippos are herbivores"
            },
            method: "POST",
            path: "/process"
        }, 1, 1)
    });
});

const sleep = (ms) => new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
});

const Bull = require("bull")
const axios = require("axios");

const extSvcHost = process.env.EXTERNAL_SERVICE_HOST;
const extSvcPort = process.env.EXTERNAL_SERVICE_PORT;

// Worker takes messages (jobs) from a queue and sends them to an external
// service for processing.
const workerFunc = (job, done) => {
    console.log("received payload from queue: ", job.data);
    setTimeout(() => {
        axios.post(`http://${extSvcHost}:${extSvcPort}/process`, job.data).
            then(
                (res) => {
                    console.log("received res from external API: ", res.data);
                },
                (err) => {
                    console.log("http request error: ", err.message)
                }
            );
        done();
    }, 2500)
}

const startWorker = () => {
    const queue = new Bull("messageQueue",
        `redis://${(process.env.REDIS_HOST)}:6379`)
    queue.process(workerFunc);
    console.log("worker started: listening to queue");
}

startWorker();

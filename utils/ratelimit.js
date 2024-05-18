import { log } from "console";
import fs from "fs";
import path from "path";

const countersFile = path.join(process.cwd(), "..", "counters.json");
const windowDuration = 4000; // 30 saniye
const maxRequestsPerWindow = 5;

export const RateLimit = {
    async limit(task) {
        let counters;
        try {
            counters = JSON.parse(fs.readFileSync(countersFile, "utf8"));
        } catch (err) {
            if (err.code === "ENOENT") {
                // counters.json does not exist, create it
                fs.writeFileSync(
                    countersFile,
                    JSON.stringify({ requestCounter: 0, nextResetTime: 0 })
                );
                counters = { requestCounter: 0, nextResetTime: 0 };
            } else {
                throw err;
            }
        }
        const { requestCounter, nextResetTime } = counters;
        if (requestCounter >= maxRequestsPerWindow) {
            const now = Date.now();
            if (now >= nextResetTime) {
                counters.requestCounter = 1;
                counters.nextResetTime = now + windowDuration;
                fs.writeFileSync(countersFile, JSON.stringify(counters));
            } else {
                const waitTime = nextResetTime - now;
                console.log(
                    `Rate limit reached. Waiting ${waitTime} ms for next window.`
                );
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
        }

        counters.requestCounter++;
        fs.writeFileSync(countersFile, JSON.stringify(counters));
        await task();
    }
};

// Her 60 saniyede bir requestCounter'ı sıfırla
setInterval(async () => {
    try {
        const counters = JSON.parse(fs.readFileSync(countersFile, 'utf8'));
        counters.requestCounter = 0;
        counters.nextResetTime = Date.now() + windowDuration;
        fs.writeFileSync(countersFile, JSON.stringify(counters));
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const counters = JSON.parse(fs.readFileSync(countersFile, 'utf8'));
        counters.requestCounter = 0;
        counters.nextResetTime = Date.now() + windowDuration;
        fs.writeFileSync(countersFile, JSON.stringify(counters));
    }

}, windowDuration);


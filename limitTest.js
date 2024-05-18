import { RateLimit } from "./utils/ratelimit.js";

async function testit() {
    await RateLimit.limit(async () => {
        console.log("test");
    });
}

setInterval(testit, 100);
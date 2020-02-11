import Bottleneck from "bottleneck";

export const RateLimiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1350,
});

import Bottleneck from "bottleneck";

export const RateLimiter = new Bottleneck({
    reservoir: 40,
    reservoirRefreshAmount: 40,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 5,
    minTime: 200,
});

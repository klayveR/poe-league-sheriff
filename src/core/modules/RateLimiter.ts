import Bottleneck from "bottleneck";

export const RateLimiter = new Bottleneck({
    reservoir: 35,
    reservoirRefreshAmount: 35,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 1,
    minTime: 1250,
});

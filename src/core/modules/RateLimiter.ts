import Bottleneck from "bottleneck";

export const RateLimiter = new Bottleneck({
    reservoir: 45,
    reservoirRefreshAmount: 45,
    reservoirRefreshInterval: 60 * 1000,
    maxConcurrent: 45,
    minTime: 500,
});

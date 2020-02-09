import { Sheriff } from "./Sheriff";

(async (): Promise<void> => {
    const sheriff: Sheriff = new Sheriff();
    await sheriff.init();
    await sheriff.run();
})();

import { ExperienceList } from "@/core/models";

export function getExperiencePercentage(experience: number): number {
    for (let i = 0; i < ExperienceList.length; i++) {
        const nextExp = ExperienceList[i];
        if (nextExp > experience) {
            let prevExp = 0;
            if (i > 0) {
                prevExp = ExperienceList[i - 1];
            }

            const remaining = nextExp - experience;
            const max = nextExp - prevExp;
            const value = max - remaining;

            return Math.floor((value / max) * 100);
        }
    }

    return 0;
}

console.log();

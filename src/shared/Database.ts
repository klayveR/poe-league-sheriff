import { uniq } from "lodash";
import low, { LowdbAsync } from "lowdb";
import { default as FileAsync } from "lowdb/adapters/FileAsync";

import { LadderCharacter, RuleViolation } from "@/core/models";
import { signale } from "@/core/modules/Logger";
import { DatabaseSchema, DatabaseViolation } from "@/shared/models/DatabaseSchema";

const defaultData: DatabaseSchema = {
    ladder: [],
    violations: [],
    checkRequired: [],
};

export class Database {
    public db: LowdbAsync<DatabaseSchema> | undefined;

    public async init(): Promise<void> {
        const file = `./db/db.json`;
        const adapter = new FileAsync(file);
        this.db = (await low(adapter)) as LowdbAsync<DatabaseSchema>;
        this.db.defaults(defaultData).write();
    }

    public existsCharacter(id: string): boolean {
        if (this.db == null) return false;

        return !!this.db
            .get("ladder")
            .find({ character: { id: id } })
            .value();
    }

    public getCharacter(id: string): LadderCharacter | undefined {
        if (this.db == null) return;
        if (!this.existsCharacter(id)) return;

        return this.db
            .get("ladder")
            .find({ character: { id: id } })
            .value();
    }

    public getCharacters(): LadderCharacter[] {
        if (this.db == null) return [];

        return this.db
            .get("ladder")
            .sortBy("rank")
            .value();
    }

    public updateLadder(ladder: LadderCharacter[]): boolean {
        if (this.db == null) return false;

        signale.database(`Updating ladder`);
        this.db.set("ladder", ladder).write();

        return true;
    }

    public updateLadderCharacter(character: LadderCharacter): boolean {
        if (this.db == null) return false;

        signale.database(`Updating character ${character.character.name} in ladder`);
        this.db
            .get("ladder")
            .find({ character: { id: character.character.id } })
            .assign(character)
            .write();

        return true;
    }

    public getViolations(): DatabaseViolation[] {
        if (this.db == null) return [];

        return this.db.get("violations").value();
    }

    public getCharacterViolations(
        characterId: string,
        active = true,
        resolved = true
    ): DatabaseViolation[] {
        if (this.db == null) return [];

        const all = this.db.get("violations").filter({ characterId: characterId });

        if (active && !resolved) {
            return all.filter({ resolved: null }).value();
        }

        if (!active && resolved) {
            return all.filter((vio) => vio.resolved != null).value();
        }

        return all.value();
    }

    public existsCharacterViolation(characterId: string, violation: RuleViolation): boolean {
        if (this.db == null) return false;

        return !!this.db
            .get("violations")
            .find({ characterId: characterId, id: violation.id })
            .value();
    }

    public addViolation(character: LadderCharacter, violation: RuleViolation): boolean {
        if (this.db == null) return false;
        if (this.existsCharacterViolation(character.character.id, violation)) {
            // Update display text if exists
            this.db
                .get("violations")
                .find({ characterId: character.character.id, id: violation.id })
                .set("display", violation.display)
                .write();

            return false;
        }

        const databaseViolation: DatabaseViolation = {
            characterId: character.character.id,
            ...violation,
            ...{
                occured: {
                    time: Date.now().toString(),
                    level: character.character.level,
                    experience: character.character.experience,
                },
                resolved: null,
            },
        };

        signale.violation(`Rule "${violation.rule}" (${violation.display}, ${violation.id})`);
        this.db
            .get("violations")
            .push(databaseViolation)
            .write();

        return true;
    }

    public resolveViolation(character: LadderCharacter, violation: RuleViolation): void {
        if (this.db == null) return;
        if (!this.existsCharacterViolation(character.character.id, violation)) return;

        signale.resolved(`Rule "${violation.rule}" (${violation.display}, ${violation.id})`);
        this.db
            .get("violations")
            .find({ characterId: character.character.id, rule: violation.rule, id: violation.id })
            .set("resolved", {
                time: Date.now().toString(),
                level: character.character.level,
                experience: character.character.experience,
            })
            .write();
    }

    public getCheckRequirements(): string[] {
        if (this.db == null) return [];

        return this.db.get("checkRequired").value();
    }

    public addCheckRequirements(characterIds: string[]): void {
        if (this.db == null) return;

        let required = [...this.getCheckRequirements(), ...characterIds];
        required = uniq(required);

        this.db.set("checkRequired", required).write();
    }

    public removeCheckRequirement(characterId: string): void {
        if (this.db == null) return;

        this.db
            .get("checkRequired")
            .pull(characterId)
            .write();
    }
}

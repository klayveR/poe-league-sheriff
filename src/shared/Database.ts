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
    private adapter: low.AdapterAsync | undefined;

    public async init(): Promise<void> {
        const file = `./db/db.json`;
        this.adapter = new FileAsync(file);
        this.db = (await low(this.adapter)) as LowdbAsync<DatabaseSchema>;
        await this.db.defaults(defaultData).write();
    }

    public async write(): Promise<void> {
        if (this.db && this.adapter) {
            return await this.db.write();
        } else {
            throw new Error("Database has not been initialized");
        }
    }

    public existsCharacter(id: string): boolean {
        if (this.db == null) return false;

        return !!this.db
            .get("ladder")
            .find({ character: { id: id } })
            .cloneDeep()
            .value();
    }

    public getCharacter(id: string): LadderCharacter | undefined {
        if (this.db == null) return;
        if (!this.existsCharacter(id)) return;

        return this.db
            .get("ladder")
            .find({ character: { id: id } })
            .cloneDeep()
            .value();
    }

    public getCharacters(): LadderCharacter[] {
        if (this.db == null) return [];

        return this.db
            .get("ladder")
            .sortBy("rank")
            .cloneDeep()
            .value();
    }

    public updateLadder(ladder: LadderCharacter[]): boolean {
        if (this.db == null) return false;

        this.db.set("ladder", ladder).value();

        return true;
    }

    public getViolations(): DatabaseViolation[] {
        if (this.db == null) return [];

        return this.db
            .get("violations")
            .cloneDeep()
            .value();
    }

    public getCharacterViolations(
        characterId: string,
        active = true,
        resolved = true
    ): DatabaseViolation[] {
        if (this.db == null) return [];

        const all = this.db.get("violations").filter({ characterId: characterId });

        if (active && !resolved) {
            return all
                .filter({ resolved: null })
                .cloneDeep()
                .value();
        }

        if (!active && resolved) {
            return all
                .filter((vio) => vio.resolved != null)
                .cloneDeep()
                .value();
        }

        return all.cloneDeep().value();
    }

    public existsCharacterViolation(characterId: string, violation: RuleViolation): boolean {
        if (this.db == null) return false;

        return !!this.db
            .get("violations")
            .find({ characterId: characterId, id: violation.id })
            .cloneDeep()
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
                .value();

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
            .value();

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
            .value();
    }

    public getCheckRequirements(): string[] {
        if (this.db == null) return [];

        return this.db.get("checkRequired").value();
    }

    public addCheckRequirements(characterIds: string[]): void {
        if (this.db == null) return;

        let required = [...this.getCheckRequirements(), ...characterIds];
        required = uniq(required);

        this.db.set("checkRequired", required).value();
    }

    public removeCheckRequirement(characterId: string): void {
        if (this.db == null) return;

        this.db
            .get("checkRequired")
            .pull(characterId)
            .value();
    }
}

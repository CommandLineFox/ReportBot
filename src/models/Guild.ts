import { ObjectId } from "bson";

export interface Report {
    id: number;
    user: string;
    reason: string;
    evidence: string;
    staff: string;
    handled: boolean;
    message?: string;
}

export interface GuildConfig {
    prefix?: string;
    submitted?: string;
    handled?: string;
    staff?: string[];
}

export interface GuildDoc {
    id: string;
    config?: GuildConfig;
    reports?: Report[];
}

export class Guild implements GuildDoc {
    _id: ObjectId;
    id: string;
    config: GuildConfig;
    reports: Report[];

    constructor(data: GuildDoc) {
        this._id = new ObjectId();
        this.id = data.id;
        this.config = data.config ?? {};
        this.reports = data.reports ?? [];
    }
}
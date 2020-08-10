import { ObjectId } from "bson";

export interface Report {
    id: number;
    user: string;
    reason: string;
    evidence: string;
    reporter: string;
    handled: boolean;
    type: boolean;
    message?: string;
}

export interface GuildDoc {
    id: string;
    reports?: Report[];
}

export class Guild implements GuildDoc {
    _id: ObjectId;
    id: string;
    reports: Report[];

    constructor(data: GuildDoc) {
        this._id = new ObjectId();
        this.id = data.id;
        this.reports = data.reports ?? [];
    }
}
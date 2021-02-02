import { ObjectId } from "bson";

export interface Roles {
    staff?: string[];
}

export interface Channels {
    submitted?: string;
    dump?: string;
}

export interface GuildConfig {
    prefix?: string;
    roles?: Roles;
    channels?: Channels;
}

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

export interface Guild {
    _id: ObjectId;
    id: string;
    config: GuildConfig;
    reports: Report[];
}

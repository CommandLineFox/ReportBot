import { ObjectId } from "bson";

export interface ReportDoc {
    user: string;
    reason: string;
    evidence: string;
    handled?: boolean;
}

export class Report implements ReportDoc {
    _id: ObjectId;
    user: string;
    reason: string;
    evidence: string;
    handled?: boolean;

    constructor(data: ReportDoc) {
        this._id = new ObjectId();
        this.user = data.user;
        this.reason = data.reason;
        this.evidence = data.evidence;
        this.handled = data.handled || false;
    }
}
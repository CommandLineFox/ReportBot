"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
class Report {
    constructor(data) {
        this._id = new bson_1.ObjectId();
        this.user = data.user;
        this.reason = data.reason;
        this.evidence = data.evidence;
        this.handled = data.handled || false;
    }
}
exports.Report = Report;
//# sourceMappingURL=Report.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../command/Command"));
const Groups_1 = require("../../Groups");
const Guild_1 = require("../../models/Guild");
class Staff extends Command_1.default {
    constructor() {
        super({ name: "Staff", triggers: ["staff"], description: "Add or remove staff roles for the server", group: Groups_1.Configuration });
    }
    async run(event) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const message = event.message;
            const database = event.client.database;
            let guild = await database.guilds.findOne({ id: event.guild.id });
            if (!guild) {
                const newguild = new Guild_1.Guild({ id: event.guild.id });
                await database.guilds.insertOne(newguild);
                guild = await database.guilds.findOne({ id: event.guild.id });
            }
            const argument = event.argument.split(' ');
            const sub = argument.shift();
            const args = argument.join(' ');
            switch (sub) {
                case "add": {
                    const role = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.find(role => role.name.toLowerCase() === args.toLowerCase());
                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    (_b = guild === null || guild === void 0 ? void 0 : guild.config.staff) === null || _b === void 0 ? void 0 : _b.push(role.id);
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: (_c = message.guild) === null || _c === void 0 ? void 0 : _c.id
                    }, guild).then(() => event.send(`${role === null || role === void 0 ? void 0 : role.name} is now a staff role.`)));
                    break;
                }
                case "remove": {
                    const role = (_d = message.guild) === null || _d === void 0 ? void 0 : _d.roles.cache.find(role => role.name.toLowerCase() === args.toLowerCase());
                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    await (database === null || database === void 0 ? void 0 : database.guilds.updateOne({
                        id: (_e = message.guild) === null || _e === void 0 ? void 0 : _e.id
                    }, {
                        "$pull": {
                            "config.roles.staff": {
                                id: role === null || role === void 0 ? void 0 : role.id
                            }
                        }
                    }).then(() => event.send(`${role === null || role === void 0 ? void 0 : role.name} is no longer a staff role.`)));
                    break;
                }
                case "list": {
                    const guild = await (database === null || database === void 0 ? void 0 : database.guilds.findOne({ id: (_f = message.guild) === null || _f === void 0 ? void 0 : _f.id }));
                    if ((guild === null || guild === void 0 ? void 0 : guild.config.staff.length) === 0) {
                        event.send("There are no staff roles.");
                        return;
                    }
                    let result = "";
                    guild === null || guild === void 0 ? void 0 : guild.config.staff.forEach((id) => {
                        var _a;
                        result = `${result}, ${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.cache.get(id).name}`;
                    });
                    event.send(`The current staff roles are: ${result.slice(2)}`);
                    break;
                }
                default: {
                    event.send("Valid subcommands are `add`, `remove` and `list`.");
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.default = Staff;
//# sourceMappingURL=Staff.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMember = exports.splitArguments = void 0;
function splitArguments(argument, amount) {
    const args = [];
    let element = "";
    let index = 0;
    while (index < argument.length) {
        if (args.length < amount - 1) {
            if (argument[index].match(/\s/)) {
                if (element.trim().length > 0) {
                    args.push(element.trim());
                }
                element = "";
            }
        }
        element += argument[index];
        index++;
    }
    if (element.trim().length > 0) {
        args.push(element.trim());
    }
    return args;
}
exports.splitArguments = splitArguments;
async function getMember(argument, guild) {
    if (!argument) {
        return;
    }
    const regex = argument.match(/^((?<username>.+?)#(?<discrim>\d{4})|<?@?!?(?<id>\d{16,18})>?)$/);
    if (regex && regex.groups) {
        if (regex.groups.username) {
            return (await guild.members.fetch({ query: regex.groups.username, limit: 1 })).first();
        }
        else if (regex.groups.id) {
            return guild.members.fetch(regex.groups.id);
        }
    }
    return (await guild.members.fetch({ query: argument, limit: 1 })).first();
}
exports.getMember = getMember;
//# sourceMappingURL=Utils.js.map
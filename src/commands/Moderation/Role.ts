import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import ArgumentHandler from "@command/ArgumentHandler";

export default class Role extends Command {
    constructor() {
        super({ name: "Role", triggers: ["role"], description: "Gives or takes a specified role from a specified user", group: Moderation });
    }

    async run(event: CommandEvent) {
        try {
            const args = await ArgumentHandler.getArguments(event, event.argument, "string", "member", "string");
            if (!args) {
                return;
            }
            const [subcommand, member, rolename] = args;
            const message = event.message;
            const channel = event.channel;
            const guild = event.guild;
            const client = event.client;

            if (rolename.toLowerCase() !== "vip" && rolename.toLowerCase !== "mvp") {
                channel.send("Invalid arguments.")
                    .then((msg) => {
                        setTimeout(() => { msg.delete() }, 5000);
                    })
                message.delete();
                return;
            }

            let role;
            switch (rolename.toLowerCase()) {
                case "vip": {
                    role = guild.roles.cache.find(role => role.id === client.config.roles.vip);
                    break;
                }
                case "mvp": {
                    role = guild.roles.cache.find(role => role.id === client.config.roles.mvp);
                    break;
                }
            }

            switch (subcommand.toLowerCase()) {
                case "add": {
                    member.roles.add(role);
                }
                case "remove": {
                    member.roles.remove(role);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
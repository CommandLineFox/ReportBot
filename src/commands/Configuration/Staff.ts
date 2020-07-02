import Command from "@command/Command";
import { Configuration } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { Guild } from "@models/Guild";

export default class Staff extends Command {
    constructor() {
        super({ name: "Staff", triggers: ["staff"], description: "Add or remove staff roles for the server", group: Configuration });
    }

    async run(event: CommandEvent) {
        try {
            const message = event.message;
            const database = event.client.database;

            let guild = await database!.guilds.findOne({ id: event.guild.id });
            if (!guild) {
                const newguild = new Guild({ id: event.guild.id });
                await database!.guilds.insertOne(newguild);
                guild = await database!.guilds.findOne({ id: event.guild.id });
            }

            const argument = event.argument.split(' ');
            const sub = argument.shift();
            const args = argument.join(' ');

            switch (sub) {
                case "add": {
                    const role = message.guild?.roles.cache.find(role => role.name.toLowerCase() === args.toLowerCase());

                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    guild?.config.roles?.staff?.push(role.id);
                    await database?.guilds.updateOne({
                        id: message.guild?.id
                    }, guild!)
                        .then(() => event.send(`${role?.name} is now a staff role.`));
                    break;
                }
                case "remove": {
                    const role = message.guild?.roles.cache.find(role => role.name.toLowerCase() === args.toLowerCase());

                    if (!role) {
                        event.send("Couldn't find the role.");
                        return;
                    }
                    await database?.guilds.updateOne({
                        id: message.guild?.id
                    }, {
                        "$pull": {
                            "config.roles.staff": {
                                id: role?.id
                            }
                        }
                    })
                        .then(() => event.send(`${role?.name} is no longer a staff role.`));
                    break;
                }
                case "list": {
                    const guild = await database?.guilds.findOne({ id: message.guild?.id });
                    if (guild?.config.roles?.staff!.length === 0) {
                        event.send("There are no staff roles.");
                        return;
                    }
                    let result = "";
                    guild?.config.roles?.staff!.forEach((id) => {
                        result = `${result}, ${message.guild?.roles.cache.get(id)!.name}`;
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
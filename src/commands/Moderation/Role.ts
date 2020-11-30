import Command from "@command/Command";
import { Moderation } from "~/Groups";
import CommandEvent from "@command/CommandEvent";
import { splitArguments } from "@utils/Utils";

export default class Role extends Command {
    public constructor() {
        super({ name: "Role", triggers: ["role"], description: "Gives or takes a specified role from a specified user", group: Moderation });
    }

    public async run(event: CommandEvent): Promise<void> {
        const client = event.client;
        const database = client.database;
        try {
            const guild = await client.getGuildFromDatabase(database!, event.guild.id);
            const [subcommand, id, roleName] = splitArguments(event.argument, 3);
            const member = await client.getMember(id, event.guild);

            if (!subcommand) {
                await event.send("You must provide a subcommand first. Valid ones are `add` and `remove`.");
            }

            if (!member) {
                await event.send("Couldn't find the user you're looking for");
                return;
            }

            const message = event.message;
            const channel = event.channel;

            if (roleName.toLowerCase() !== "vip" && roleName.toLowerCase() !== "mvp") {
                channel.send("Role name can only be VIP or MVP")
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
                    });
                await message.delete();
                return;
            }

            let role;
            switch (roleName.toLowerCase()) {
                case "vip": {
                    role = event.guild.roles.cache.find(role => role.id === guild?.config.roles?.vip);
                    break;
                }
                case "mvp": {
                    role = event.guild.roles.cache.find(role => role.id === guild?.config.roles!.mvp);
                    break;
                }
            }

            if (!role) {
                await event.send("Couldn't find the role you're looking for");
                return;
            }

            switch (subcommand.toLowerCase()) {
                case "add": {
                    await member.roles.add(role);
                    await event.send(`Added ${role?.name} to ${member.user.tag}`);
                    break;
                }
                case "remove": {
                    await member.roles.remove(role);
                    await event.send(`Removed ${role?.name} from ${member.user.tag}`);
                    break;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

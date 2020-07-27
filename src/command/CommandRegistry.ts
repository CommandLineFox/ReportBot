import Command from "@command/Command";
import Group from "@command/Group";
import Help from "@commands/Basic/Help";
import Ping from "@commands/Basic/Ping";
import Echo from "@commands/OwnerOnly/Echo";
import Eval from "@commands/OwnerOnly/Eval";
import LogOff from "@commands/OwnerOnly/LogOff";
import Report from "@commands/Moderation/Report";
import Role from "@commands/Moderation/Role";

class CommandRegistry {
    readonly commands: ReadonlyArray<Command> = [
        new Help(),
        new Ping(),
        new Report(),
        new Role(),
        new Echo(),
        new Eval(),
        new LogOff()
    ];
    readonly groups: ReadonlyArray<Group> = this.commands.map((command) => command.group).filter((group, index, self) => self.indexOf(group) === index);

    getCommands(group: Group): ReadonlyArray<Command> {
        return this.commands.filter((command) => command.group === group);
    }

    getCommand(trigger: string): Command | undefined {
        return this.commands.find((command) => command.triggers.includes(trigger.toLowerCase()));
    }
}

export default new CommandRegistry();
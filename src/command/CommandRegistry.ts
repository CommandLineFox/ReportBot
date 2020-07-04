import Command from "@command/Command";
import Group from "@command/Group";
import Staff from "~/commands/Configuration/Staff";
import Help from "@commands/Basic/Help";
import Ping from "@commands/Basic/Ping";
import Submit from "@commands/Moderation/Submit";
import Echo from "@commands/OwnerOnly/Echo";
import Eval from "@commands/OwnerOnly/Eval";
import LogOff from "@commands/OwnerOnly/LogOff";
import Report from "~/commands/PublicAccess/Report";

class CommandRegistry {
    readonly commands: ReadonlyArray<Command> = [
        new Staff(),
        new Help(),
        new Report(),
        new Ping(),
        new Submit(),
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
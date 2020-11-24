import Command from "@command/Command";
import Group from "@command/Group";
import Config from "@commands/Administration/Config";
import Help from "@commands/Basic/Help";
import Ping from "@commands/Basic/Ping";
import Echo from "@commands/OwnerOnly/Echo";
import Eval from "@commands/OwnerOnly/Eval";
import LogOff from "@commands/OwnerOnly/LogOff";
import Report from "@commands/Moderation/Report";
import Role from "@commands/Moderation/Role";
import Solve from "@commands/Moderation/Solve";
import Reopen from "@commands/Moderation/Reopen";
import Edit from "@commands/Moderation/Edit";

class CommandRegistry {
    public readonly commands: readonly Command[] = [
        new Help(),
        new Ping(),
        new Config(),
        new Edit(),
        new Report(),
        new Role(),
        new Solve(),
        new Reopen(),
        new Echo(),
        new Eval(),
        new LogOff()
    ];
    public readonly groups: readonly Group[] = this.commands.map((command) => command.group).filter((group, index, self) => self.indexOf(group) === index);

    public getCommands(group: Group): readonly Command[] {
        return this.commands.filter((command) => command.group === group);
    }

    public getCommand(trigger: string): Command | undefined {
        return this.commands.find((command) => command.triggers.includes(trigger.toLowerCase()));
    }
}

export default new CommandRegistry();

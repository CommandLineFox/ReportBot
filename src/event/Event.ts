import BotClient from "~/BotClient";

type EventFunction = (client: BotClient, ...args: any[]) => void;

export default class Event {
    public constructor(public name: string, public func: EventFunction) {
    }
}

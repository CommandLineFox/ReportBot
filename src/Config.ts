import { string, object, boolean, array, base } from "~/ConfigHandler";

export default {
    token: string(""),
    prefix: string("!"),
    owners: array(base.string),
    channels: object({
        submitted: string(""),
        suggestions: array(base.string)
    }),
    roles: object({
        member: string(""),
        vip: string(""),
        mvp: string(""),
        staff: array(base.string)
    }),
    colors: object({
        staff: string(""),
        member: string("")
    }),
    db: object({
        name: string(""),
        url: string(""),
        mongoOptions: object({
            useUnifiedTopology: boolean(true)
        })
    })
}
import Group from "@command/Group";

export const Basic = new Group({ name: "Basic", description: "" });
export const PublicAccess = new Group({ name: "Public", description: "", guildOnly: true });
export const Moderation = new Group({ name: "Moderation", description: "", guildOnly: true, modOnly: true });
export const Administration = new Group({ name: "Admin Only", description: "", guildOnly: true, adminOnly: true });
export const OwnerOnly = new Group({ name: "Owner Only", description: "", ownerOnly: true });

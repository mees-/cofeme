import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  groups: {
    members: r.many.members({
      from: r.groups.id,
      to: r.members.groupId,
    }),
    coffeeRounds: r.many.coffeeRounds(),
  },
  members: {
    group: r.one.groups({
      from: r.members.groupId,
      to: r.groups.id,
    }),
    registrations: r.many.coffeeRegistrations(),
  },
  coffeeRounds: {
    group: r.one.groups({
      from: r.coffeeRounds.groupId,
      to: r.groups.id,
    }),
    assignedMember: r.one.members({
      from: r.coffeeRounds.assignedTo,
      to: r.members.id,
    }),
    registrations: r.many.coffeeRegistrations(),
  },
  coffeeRegistrations: {
    round: r.one.coffeeRounds({
      from: r.coffeeRegistrations.roundId,
      to: r.coffeeRounds.id,
    }),
    member: r.one.members({
      from: r.coffeeRegistrations.memberId,
      to: r.members.id,
    }),
  },
}));


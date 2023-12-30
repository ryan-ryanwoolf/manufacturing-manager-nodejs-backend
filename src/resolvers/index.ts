import UserResolver from "../resolvers/user.resolver";
console.log("Resolvers:", [UserResolver]);

export const resolvers = [UserResolver] as const;
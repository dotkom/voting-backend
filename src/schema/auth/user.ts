import { Context } from '../../context';
import withAuth from 'graphql-auth';
import { extendType, list, nonNull, objectType, stringArg } from 'nexus';

export const User = objectType({
    name: 'User',
    definition(t) {
        // t.model = kommer fra nexus-prisma-plugin. Biblioteket har vært litt stale pga rewrite
        // Pluginen lager mapper prisma
        // t.model.id();
        // t.model.username();
        // t.model.email();
        // Evt kan vi definere graphql typene manuelt
        t.nonNull.id('id');
        t.nonNull.string('username');
        t.nonNull.string('email');
    },
});

export const UserQuery = extendType({
    type: 'Query',
    definition: (t) => {
        t.nonNull.field('users', {
            type: list(User),
            resolve: withAuth(async (_: any, __: any, ctx: Context) => {
                const users = await ctx.prisma.user.findMany();
                return users;
            }),
        });
    },
});

export const UserMutation = extendType({
    type: 'Mutation',
    definition: (t) => {
        t.field('addUser', {
            type: User,
            args: {
                id: nonNull(stringArg()),
                username: nonNull(stringArg()),
                email: nonNull(stringArg()),
            },
            // args typen i resolver er mappa til args typen definnert over
            resolve: async (_, args, ctx) => {
                const user = await ctx.prisma.user.create({ data: { ...args } });
                return user;
            },
        });
    },
});

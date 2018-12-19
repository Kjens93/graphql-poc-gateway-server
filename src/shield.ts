import { shield, rule, and, or, deny } from "graphql-shield";
import { IOptionsConstructor, ShieldRule } from "graphql-shield/dist/types";

const isAuthenticated: ShieldRule = rule({ cache: 'contextual' })((parent, args, ctx, info) => {
    return ctx.jwt !== null;
});

const isAdmin: ShieldRule = rule({ cache: 'contextual' })((parent, args, ctx, info) => {
    return ctx.jwt.authorities.indexOf('administrator') !== -1;
});

const isSelfForCustomerId: ShieldRule = rule({ cache: 'strict' })((parent, args, ctx, info) => {
    console.dir(parent, { depth: 3 });
    return ctx.jwt.sub === parent.id;
});

function options(): IOptionsConstructor {
    return {
        fallbackRule: deny,
        fallbackError: 'Not Authorized',
        graphiql: true,
        allowExternalErrors: true
    }
}

export function createShield() {
    return shield({
        Query: {
            customer: isAuthenticated,
            customers: isAuthenticated
        },
        Customer: and(isAuthenticated, or(isAdmin, isSelfForCustomerId)),
        CustomerAddress: isAuthenticated
    }, options());
}
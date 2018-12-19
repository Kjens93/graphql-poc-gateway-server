import fetch from "node-fetch";
import { GraphQLSchema } from "graphql";
import { createHttpLink } from "apollo-link-http";
import { introspectSchema, makeRemoteExecutableSchema } from "graphql-tools";

export async function remote(uri: string): Promise<GraphQLSchema> {
    console.log(`Linking remote schema ${uri}`);

    // 1. Create Apollo Link that's connected to the underlying GraphQL API
    const link = createHttpLink({ uri, fetch });

    // 2. Retrieve schema definition of the underlying GraphQL API
    const schema = await introspectSchema(link);

    // 3. Create the executable schema based on schema definition and Apollo Link
    const executableSchema = makeRemoteExecutableSchema({ schema, link });

    return executableSchema;
}
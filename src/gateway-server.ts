import { ApolloServer } from 'apollo-server';
import { mergeSchemas } from 'graphql-tools';
import * as compression from 'compression';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { jwt } from './jwt';
import { createShield } from './shield';
import { remote } from './remote';
import { AddressInfo } from 'net';

export class GatewayServer {

    private async createSchema(): Promise<GraphQLSchema> {
        let schema = mergeSchemas({
            schemas: [
                await remote('https://us1.prisma.sh/kyler-jensen-0cf633/pizza/dev'),
                await remote('https://us1.prisma.sh/kyler-jensen-0cf633/hierarchy/dev')
            ]
        });
        const shield = createShield();
        schema = applyMiddleware(schema, shield);
        return schema;
    }

    private async createGraphQLServer(schema: GraphQLSchema): Promise<ApolloServer> {
        return new ApolloServer({
            schema,
            context: params => ({
                ...params,
                jwt: jwt(params)
            })
        });
    }

    public async start(): Promise<void> {
        const schema = await this.createSchema();
        const server = await this.createGraphQLServer(schema);
        const httpd = await server.listen();
        const port = httpd.port;
        console.log(`Server:     Listening on http://localhost:${port}/ [POST] and http://localhost:${port}/graphql [GET]`);
        console.log(`Playground: Listening on http://localhost:${port}/ [GET]`);
    }

}

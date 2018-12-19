import * as JwtDecode from 'jwt-decode';
import { Context } from "apollo-server-core";

export function jwt(context: Context): object | undefined {
    const header = context.request.header("Authorization");
    if (typeof header === 'string') {
        const parts = header.split(' ');
        const token = parts[1];
        const decoded = JwtDecode(token);
        return decoded;
    }
}
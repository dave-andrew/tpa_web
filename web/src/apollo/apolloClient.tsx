import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/query'
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: `${localStorage.getItem("jwt") || ""}`
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

const updateTokenAndResetCache = (newToken : string) => {
    localStorage.setItem("jwt", newToken);
    client.resetStore(); // Clear Apollo Client's cache
};

export { client, updateTokenAndResetCache };

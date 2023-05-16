import {
  createHttpLink,
  ApolloLink,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client/core";

import { provideApolloClient } from "@vue/apollo-composable";

export default defineNuxtPlugin((nuxtApp) => {
  const cookie = useCookie("woo-session", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  const authorization = useCookie("authorization", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  const woocommerceSession = useCookie("woocommerce-session", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  
  const config = useRuntimeConfig();
  const httpLink = createHttpLink({
    uri: "http://localhost:8080/graphql",
  });

  const middleware = new ApolloLink((operation, forward) => {
    /**
     * If session data exist in local storage, set value as session header.
     */
    // if (process.client && authorization.value) {
    //   debugger
    //   operation.setContext(async ({ context: { headers: currentHeaders } = {} }) => {
    //     return {
    //       headers: {
    //       ...currentHeaders,
    //       authorization: `Bearer ${authorization.value}`,
    //       'woocommerce-session': `Session ${woocommerceSession.value}`
    //     }
    //   }
    //   });
    // }
    if (process.client && cookie.value && operation.operationName !== 'LoginUser') {
      operation.setContext(() => ({
         headers: {
           "woocommerce-session": `Session ${cookie.value}`,
           "Authorization": `Bearer ${authorization.value}`,
         },
       }));
    }
    return forward(operation);
  });

  const afterware = new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      /**
       * Check for session header and update session in local storage accordingly.
       */
      debugger

      const context = operation.getContext();
      if(response.data.login !== undefined) {
        authorization.value = response.data.login.authToken
        woocommerceSession.value = response.data.login.customer.jwtAuthToken

      }
      const {
        response: { headers },
      } = context;

      const session = headers.get("woocommerce-session") || headers.get("Authorization") || cookie.value;

      if (process.client && session) {
        if (session !== cookie.value) {
          cookie.value = session;
        }
      }
      return response;
    })
  );

  // Cache implementation
  const cache = new InMemoryCache();

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: middleware.concat(afterware.concat(httpLink)),
    cache,
  });

  provideApolloClient(apolloClient);

  nuxtApp.hook("apollo:auth", ({ token }) => {
    token.value = cookie.value;
  });
});

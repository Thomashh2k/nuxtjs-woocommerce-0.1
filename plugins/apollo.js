import {
  createHttpLink,
  ApolloLink,
  InMemoryCache,
  from,
  ApolloClient,
} from "@apollo/client/core";
import { onError } from '@apollo/client/link/error';
import { useAuth } from "~/store/useAuth";
import { provideApolloClient } from "@vue/apollo-composable";
import { refreshAuthToken, checkExpired } from "~/utils/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const cookie = useCookie("woo-session", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  const authorization = useCookie("authorization", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  const refreshToken = useCookie("refreshToken", {
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

  const middleware = new ApolloLink(async (operation, forward) => {
    /**
     * If session data exist in local storage, set value as session header.
     */
    // if (process.client && authorization.value) {
    //   
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
    if (process.client && cookie.value) {
      if (checkExpired(cookie.value)) {
        const authStore = useAuth()
        const newAccessToken = await refreshAuthToken(authStore.refreshToken);
      }
      operation.setContext(() => ({
         headers: {
           "woocommerce-session": `Session ${cookie.value}`,
          //  "Authorization": `Bearer ${authorization.value}`,
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
      const context = operation.getContext();
      if(response.data.login !== undefined) {
        authorization.value = response.data.login.authToken
        // woocommerceSession.value = response.data.login.customer.jwtAuthToken

      }
      const {
        response: { headers },
      } = context;

      const session = headers.get("woocommerce-session") || headers.get("Authorization") || cookie.value;
      // const refreshToken = headers.get("") || headers.get("") || authStore.refreshToken

      if (process.client && session) {
        if (session !== cookie.value) {
          cookie.value = session;
          // TODO SET REFESH TOKEN in store and cookie
        }
      }
      const returnedHeader = headers.get('woocommerce-session');
      if (returnedHeader) {
        if ( localStorage.getItem('woo-session') !== returnedHeader ) {
          cookie.value = headers.get('woocommerce-session');
        }
      }
      return response;
    })
  );
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.error('GraphQL Error:', message);
        if(message.includes('expired') || message.includes('Invalid')) {
          // ON EXPIRED TOKEN 
          const newAccessToken = refreshAuthToken(authStore.refreshToken);
          // Hier kannst du den Fehler behandeln oder andere Aktionen ausführen
        }
      });
    }
  
    if (networkError) {
      console.error('Network Error:', networkError);
      // Hier kannst du den Netzwerkfehler behandeln oder andere Aktionen ausführen
    }
  });
  // Cache implementation
  const cache = new InMemoryCache();
  const link = ApolloLink.from([
    middleware,
    afterware,
    errorLink,
    httpLink,
  ])
  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: link,
    // link: link,
    cache,
  });

  provideApolloClient(apolloClient);

  nuxtApp.hook("apollo:auth", ({ token }) => {
    token.value = cookie.value;
  });
});
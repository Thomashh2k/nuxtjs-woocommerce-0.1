import {
  createHttpLink,
  ApolloLink,
  InMemoryCache,
  from,
  ApolloClient,
} from "@apollo/client/core";
import { onError } from '@apollo/client/link/error';
import { provideApolloClient } from "@vue/apollo-composable";
import { checkExpired } from '@/utils/auth'
import { useAuth } from '@/store/useAuth'
import { GraphQLClient } from 'graphql-request'
import REFRESH_AUTH_TOKEN from "@/apollo/mutations/REFRESH_AUTH_TOKEN.gql";
import GET_CART_DOCUMENT from "@/apollo/queries/GET_CART_DOCUMENT.gql";

export default defineNuxtPlugin((nuxtApp) => {
  const authorization = useCookie("wp-auth", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  const jwtRefreshToken = useCookie("JWT-Refresh", {
    maxAge: 86_400,
    sameSite: "lax",
  });
  const woocommerceSession = useCookie("woocommerce-session", {
    maxAge: 86_400,
    sameSite: "lax",
  });

  const targetErrors = [
    'The iss do not match with this server',
    'invalid-secret-key | Expired token',
    'invalid-secret-key | Wrong number of segments',
    'invalid-secret-key | Signature verification failed',
    'Expired token',
    'Wrong number of segments',
  ];

  let tokenSetter;
  const config = useRuntimeConfig();
  const httpLink = createHttpLink({
    uri: config.public.PUBLIC_GRAPHQL_URL,
  });

  async function getSessionToken(forceFetch = false) {
    let sessionToken = woocommerceSession.value;
    if (!sessionToken || forceFetch) {
      sessionToken = await fetchSessionToken();
    }
    return sessionToken;
  }

  async function getAuthToken() {
      let authToken = authorization.value;
      if (!authToken || checkExpired(authToken)) {
        authToken = await fetchAuthToken();
      }
      return authToken;
  }

  async function fetchAuthToken() {
    const authStore = useAuth();
    const refreshToken = jwtRefreshToken.value;
    let authToken;
    if (!refreshToken) {
      // No refresh token means the user is not authenticated.
      debugger
      // causes bug needs to be fixed
      // authStore.setLoginStatus(false)
      return;
    }
  
    try {
  
      const graphQLClient = new GraphQLClient(config.public.PUBLIC_GRAPHQL_URL);
      const results = await graphQLClient.request(REFRESH_AUTH_TOKEN, {refreshToken: refreshToken});
      authToken = results?.refreshJwtAuthToken?.authToken;
  
      if (!authToken) {
        throw new Error('Failed to retrieve a new auth token');
      }
    } catch (err) {
      console.error(err);
    }
  
    return authToken;
  }

  function hasCredentials() {
    const authToken = authorization.value;
    const refreshToken = jwtRefreshToken.value;
  
    if (!!authToken && !!refreshToken) {
      return true;
    }
  
    return false;
  }

  async function fetchSessionToken() {
    const headers = {};
    
    const authToken = await getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    let sessionToken;
    try {
      const graphQLClient = new GraphQLClient(config.public.PUBLIC_GRAPHQL_URL);
      
  
      const cartData = await graphQLClient.request(GET_CART_DOCUMENT, {}, headers)
      // If user doesn't have an account return accountNeeded flag.
      sessionToken = cartData?.customer?.sessionToken;
  
      if (!sessionToken) {
        throw new Error('Failed to retrieve a new session token');
      }
    } catch (err) {
      const hasTokenError = targetErrors.includes(err);
      if(hasTokenError) {
        await fetchAuthToken();
      }
    }
  
    return sessionToken;
  }

  const middleware = new ApolloLink(async (operation, forward) => {
    operation.setContext(async ({ context: { headers: currentHeaders } = {} }) => {
      const headers = { ...currentHeaders };
      const authToken = await getAuthToken();
      const sessionToken = await getSessionToken();
      const authStore = useAuth();
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
        authorization.value = authToken;
      }
  
      if (sessionToken) {
        headers['woocommerce-session'] = `Session ${sessionToken}`;
        woocommerceSession.value = sessionToken;

      }
  
      if (authToken || sessionToken) {
        return { headers };
      } else {
        debugger
        authStore.setLoginStatus(false)
        return {};
      }
    });
    return forward(operation);
  });

  const afterware = new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      /**
       * Check for session header and update session in local storage accordingly. 
       */
      const context = operation.getContext();
      const { response: { headers } } = context;
      console.log('------------------');
      console.log(context.response);
      const oldSessionToken = woocommerceSession.value;
      const sessionToken = context.response.headers.get('woocommerce-session')
      console.log('sessionToken: ' + sessionToken);

      if (sessionToken !== undefined) {
        if (oldSessionToken !== sessionToken) {
          woocommerceSession.value = sessionToken;
          console.log('token set: ' + woocommerceSession.value);

        }
      }

      return response;
    })
  );

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    let observable;
    if (graphQLErrors?.length) {
      graphQLErrors.map(({ debugMessage, message }) => {
        if (targetErrors.includes(message) || targetErrors.includes(debugMessage)) {
          observable = new Observable((observer) => {
            getSessionToken(true)
              .then((sessionToken) => {
                operation.setContext(({ headers = {} }) => {
                  const nextHeaders = headers;

                  if (sessionToken) {
                    nextHeaders['woocommerce-session'] = `${sessionToken}`;
                  } else {
                    delete nextHeaders['woocommerce-session'];
                  }

                  return {
                    headers: nextHeaders,
                  };
              });
            })
            .then(() => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            })
            .catch((error) => {
              observer.error(error);
            });
        });
      }
      });
    }
    return observable;
  });

  // Cache implementation
  const cache = new InMemoryCache();
  const link = ApolloLink.from([
    middleware,
    errorLink,
    afterware,
    httpLink,
  ])
  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: link,
    cache,
  });

  provideApolloClient(apolloClient);

  nuxtApp.hook("apollo:auth", ({ token }) => {
    token.value = authorization.value;
  });
  const useQuery = async (query, variables = {}) => {
    try {
      const response = await apolloClient.query({ query, variables });
      return response.data;
    } catch (error) {
      console.error('Fehler bei der GraphQL-Abfrage:', error);
      throw error;
    }
  };

  const useMutate = async (mutation, variables = {}) => {
    try {
      const response = await apolloClient.mutate({ mutation, variables });
      return response.data;
    } catch (error) {
      console.error('Fehler bei der GraphQL-Mutation:', error);
      throw error;
    }
  };
  
  return {
    provide: {
      apolloClient: apolloClient,
      useMutate: useMutate,
      useQuery: useQuery,
      getAuthToken: getAuthToken,
      wpAuth: authorization,
      woocommerceSession: woocommerceSession,
    }
  }
});



import { setContext } from '@apollo/client/link/context';
import { useAuth } from '~/store/useAuth';
// import { gql } from '@apollo/client';

const GetCartDocument = gql`
  query {
    customer {
      sessionToken
    }
  }
`;
export function createSessionLink() {
    return setContext(async ({ context: { headers: currentHeaders } = {} }) => {
      const headers = { ...currentHeaders };
      const authToken = await getAuthToken();
      const sessionToken = await getSessionToken();
  
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
  
      if (sessionToken) {
        headers['woocommerce-session'] = `${sessionToken}`;
      }
  
      if (authToken || sessionToken) {
        return { headers };
      }
  
      return {};
    });
}


function hasCredentials() {
    const authorization = useCookie("wp-auth");
    const authToken = authorization.value;
    const useAuthStore = useAuth();
    const refreshToken = useAuthStore.refreshJwt;
  
    if (!!authToken && !!refreshToken) {
      return true;
    }
  
    return false;
}

export async function fetchAuthToken() {
    let tokenSetter;
    const useAuthStore = useAuth();
    const refreshToken = useAuthStore.refreshJwt;
    if (!refreshToken) {
      // No refresh token means the user is not authenticated.
      return;
    }
  
    try {


      const newAccessToken = await refreshAuthToken(refreshToken);
      const authToken = newAccessToken;

      if (!authToken) {
        throw new Error('Failed to retrieve a new auth token');
      }
    } catch (err) {
      console.error(err);
    }
  
    // Save token.
    const authorization = useCookie("wp-auth");
    authorization.value = authToken
    if (tokenSetter) {
      clearInterval(tokenSetter);
    }
    tokenSetter = setInterval(
      async () => {
        if (!hasCredentials()) {
          clearInterval(tokenSetter);
          return;
        }
        fetchAuthToken();
      },
      Number(process.env.AUTH_KEY_TIMEOUT || 30000),
    );
  
    return authToken;
}

export async function fetchSessionToken() {
    const headers = {};
    const authToken = await getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  
    let sessionToken;
    try {
      const cartData = await useAsyncQuery(GetCartDocument, { headers })
      cartData.execute();
      // If user doesn't have an account return accountNeeded flag.
      sessionToken = cartData?.cart?.sessionToken;
  
      if (!sessionToken) {
        throw new Error('Failed to retrieve a new session token');
      }
    } catch (err) {
      console.error(err);
    }
  
    return sessionToken;
}
// export function saveCredentials(authToken, sessionToken, refreshToken = null) {
//     sessionStorage.setItem('authorization', authToken);
//     sessionStorage.setItem('woocommerce-session', sessionToken);
//     if (refreshToken) {
//         const useAuthStore = useAuth();
//         useAuthStore.setRefreshToken(refreshToken);
//     }
// }
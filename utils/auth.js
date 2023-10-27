import { useAuth } from "@/store/useAuth";
import { useSnackbar } from "@/store/snackbar";
import LOGIN_USER_MUTATION from "@/apollo/mutations/LOGIN_USER_MUTATION.gql";
import REFRESH_AUTH_TOKEN from "@/apollo/mutations/REFRESH_AUTH_TOKEN.gql";
import REGISTER_CUSTOMER_MUTATION from '@/apollo/mutations/REGISTER_CUSTOMER_MUTATION.gql'

export async function login (payload) {
  return new Promise((resolve, reject) => {
    const authStore = useAuth();

    const loginVariables = { input: payload };
    const { mutate, onDone, onError} = useMutation(LOGIN_USER_MUTATION, { variables: loginVariables });
    mutate(payload);
    onDone((result) => {
      const snackbar = useSnackbar()

      if(result.data.login.customer.billing.firstName === null) {
        result.data.login.customer.billing = result.data.login.customer.shipping
      }

      const authorization = useCookie("wp-auth");
      const jwtRefreshToken = useCookie("JWT-Refresh");

      jwtRefreshToken.value = result.data.login.refreshToken
      authorization.value = result.data.login.authToken

      authStore.setUser(result.data.login.user)
      authStore.setCustomer(result.data.login.customer)
      authStore.setLoginStatus(true)
      snackbar.setMessage('Anmeldung erfolgreich', 'success')
      resolve()
    })
    onError((err) => {
      const snackbar = useSnackbar()
      snackbar.setMessage("Login fehlgeschlagen. Stellen sie sicher das, die Anmeldedaten korrekt sind.", 'error')
      reject()
    })
  })
};

export async function registerCustomer(payload, router) {
  const authStore = useAuth();

  const registerVariables = { 
    input: {
      firstName: payload.firstName.charAt(0).toUpperCase() + payload.firstName.slice(1),
      lastName: payload.lastName.charAt(0).toUpperCase() + payload.lastName.slice(1),
      email: payload.email,
      username: payload.email,
      password: payload.password,
      shipping: {
        // address1: payload.address.charAt(0).toUpperCase() + payload.address.slice(1),
        address1: payload.address,
        address2: payload.addressNr,
        // city: payload.city.charAt(0).toUpperCase() + payload.city.slice(1),
        country: 'DE', // WiP...
        postcode: payload.zipCode,
        firstName: payload.firstName.charAt(0).toUpperCase() + payload.firstName.slice(1),
        lastName: payload.lastName.charAt(0).toUpperCase() + payload.lastName.slice(1),
      }
  }};

  const { mutate, onDone, onError } = useMutation(REGISTER_CUSTOMER_MUTATION, { variables: registerVariables });
  mutate(payload);

 onDone((result) => {
    if(result.data.registerCustomer.authToken) {
      authStore.setUser({
        freshlyRegistered: true,
        firstName: registerVariables.input.firstName,
        lastName: registerVariables.input.lastName,
        email: registerVariables.input.email,
      })
      router.push('/account/registered')
    }
  })

  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message, 'error')
  })

}

export function checkExpired(accessToken) {
  if (process.client) {  
    const expIndex = 'exp'
    const decodedToken = parseJwt(accessToken)
    /*  
        Expiry time is in seconds with our example data, 
        we need milliseconds (might be different in other implementations) so we do *1000
    */
    const expiresAt = new Date((decodedToken[expIndex]) * 1000)
    const now = new Date()
    if (now < expiresAt) {
        //  Not expired
        return false;
    } else {
        //  Expired
        return true;
    }
  }
}

export async function refreshAuthToken(refreshToken) {
  const refreshVariables = { refreshToken: refreshToken };
  const { mutate, onDone, onError} = useMutation(REFRESH_AUTH_TOKEN, { variables: refreshVariables });
  mutate(refreshVariables);
  const resultDone = onDone((result) => {
    const authStore = useAuth();
    // authStore.setToken(result.data.refreshAuthToken.authToken)
    return result.data.refreshAuthToken.authToken
  })
  const resultErr = onError((err) => {
    return err
  })
}

function parseJwt (token) {
  
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
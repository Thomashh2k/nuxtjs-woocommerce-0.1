import { useAuth } from "@/store/useAuth";
import { useSnackbar } from "@/store/snackbar";
import LOGIN_USER_MUTATION from "@/apollo/mutations/LOGIN_USER_MUTATION.gql";
import REGISTER_CUSTOMER_MUTATION from '@/apollo/mutations/REGISTER_CUSTOMER_MUTATION.gql'
export async function login (payload) {
  return new Promise((resolve, reject) => {
    const authStore = useAuth();

    const loginVariables = { input: payload };
    const { mutate, onDone, onError} = useMutation(LOGIN_USER_MUTATION, { variables: loginVariables });
    mutate(payload);
    const resultDone = onDone((result) => {
      debugger
      const snackbar = useSnackbar()

      if(result.data.login.customer.billing.firstName === null) {
        result.data.login.customer.billing = result.data.login.customer.shipping
      }
      authStore.setToken(result.data.login.authToken)
      authStore.setRefreshToken(result.data.login.refreshToken)
      authStore.setCustomerJwt(result.data.login.customer.jwtAuthToken)
      authStore.setToken(result.data.login.authToken)
      authStore.setUser(result.data.login.user)
      authStore.setCustomer(result.data.login.customer)

      snackbar.setMessage('Anmeldung erfolgreich', 'success')
      resolve()
    })
    const resultErr = onError((err) => {
      debugger
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
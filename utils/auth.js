import { useAuth } from "@/store/useAuth";
import LOGIN_USER_MUTATION from "@/apollo/mutations/LOGIN_USER_MUTATION.gql";
import REGISTER_CUSTOMER_MUTATION from '@/apollo/mutations/REGISTER_CUSTOMER_MUTATION.gql'
export function login (payload) {

    const authStore = useAuth();

    const loginVariables = { input: payload };
    const { mutate, onDone} = useMutation(LOGIN_USER_MUTATION, { variables: loginVariables });
    mutate(payload);
    const result = onDone((result) => {
      authStore.setToken(result.data.login.authToken)
      authStore.setUser(result.data.login.user)
    })

    return result
};

export function registerCustomer(payload, router) {
  const authStore = useAuth();

  const registerVariables = { input: { 
    firstName: payload.firstName.charAt(0).toUpperCase() + payload.firstName.slice(1),
    lastName: payload.lastName.charAt(0).toUpperCase() + payload.lastName.slice(1),
    email: payload.email,
    username: payload.username,
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
  const { mutate, onDone } = useMutation(REGISTER_CUSTOMER_MUTATION, { variables: registerVariables });
  mutate(payload);
  const result = onDone((result) => {
    if(result.data.registerCustomer.authToken) {
      authStore.setUser({
        freshlyRegistered: true,
        firstName: registerVariables.input.firstName,
        lastName: registerVariables.input.lastName,
        email: registerVariables.input.email,
      })
      router.push('/account/registered')
    }
    return result
  })

  return result
}
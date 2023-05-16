import FETCH_CUSTOMER_DATA from '@/apollo/queries/FETCH_CUSTOMER_DATA.gql'

import SEND_PASSWORD_RESET_EMAIL from '@/apollo/mutations/user/SEND_PASSWORD_RESET_EMAIL.gql'
import UPDATE_USER_INFO from '@/apollo/mutations/user/UPDATE_USER_INFO.gql'
import UPDATE_USER_BILLING from '@/apollo/mutations/user/UPDATE_USER_BILLING.gql'
import UPDATE_USER_SHIPPING from '@/apollo/mutations/user/UPDATE_USER_SHIPPING.gql'
import UPDATE_USER_PASSWORD from '@/apollo/mutations/user/UPDATE_USER_PASSWORD.gql'
import { useSnackbar } from "@/store/snackbar";
import { useAuth } from '@/store/useAuth.js'

export async function updateUserInfo(userInfo) {
  debugger
  const userInfoVar = {
      input: {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      },
    };
    console.log(userInfoVar)
    const { mutate, onError, onDone } = useMutation(UPDATE_USER_INFO, {
      variables: userInfoVar
    });
  
    mutate(userInfoVar);
    
    onError((err) => {
      const snackbar = useSnackbar()
      snackbar.setMessage(err.message, 'error')
    })
    onDone((result) => {
      const authStore = useAuth();
      const snackbar = useSnackbar()

      authStore.setRefreshToken(result.data.updateCustomer.refreshToken);
      authStore.setCustomerJwt(result.data.updateCustomer.customer.jwtAuthToken);
      authStore.setToken(result.data.updateCustomer.authToken);

      authStore.setUser(userInfo);

      snackbar.setMessage('Persöhnliche Daten aktualisiert', 'success');
    })
}

export async function updateUserShipping(customerInfo, userInfo) {
  delete customerInfo.shipping.__typename
  const shippingVar = {
      input: {
        id: userInfo.id,
        shipping: customerInfo.shipping,
      },
    };
    console.log(shippingVar)
    const { mutate, onError, onDone } = useMutation(UPDATE_USER_SHIPPING, {
      variables: shippingVar
    });
  
    mutate(shippingVar);
    
    onError((err) => {
      const snackbar = useSnackbar()
      snackbar.setMessage(err.message, 'error')
    })
    onDone((result) => {
      const authStore = useAuth();
      const snackbar = useSnackbar()

      authStore.setRefreshToken(result.data.login.refreshToken)
      authStore.setCustomerJwt(result.data.login.customer.jwtAuthToken)
      authStore.setToken(result.data.login.authToken)

      authStore.setCustomer(customerInfo)

      snackbar.setMessage('Lieferanschrift aktualisiert', 'success')

    })
}

export async function updateUserBilling(customerInfo, userInfo) {
  delete customerInfo.billing.__typename
  const billingVar = {
      input: {
        id: userInfo.id,
        billing: customerInfo.billing,
      },
    };
    console.log(billingVar)
    const { mutate, onError, onDone } = useMutation(UPDATE_USER_BILLING, {
      variables: billingVar
    });
  
    mutate(billingVar);
    
    onError((err) => {
      const snackbar = useSnackbar()
      snackbar.setMessage(err.message, 'error')
    })
    onDone((result) => {
      const authStore = useAuth();
      const snackbar = useSnackbar()

      authStore.setRefreshToken(result.data.login.refreshToken)
      authStore.setCustomerJwt(result.data.login.customer.jwtAuthToken)
      authStore.setToken(result.data.login.authToken)

      authStore.setCustomer(customerInfo)

      snackbar.setMessage('Rechnungsadresse aktualisiert', 'success')

    })
}

export async function updateUserPassword() {
    
}
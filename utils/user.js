import FETCH_CUSTOMER_DATA from '@/apollo/queries/FETCH_CUSTOMER_DATA.gql'

import UPDATE_USER_INFO from '@/apollo/mutations/user/UPDATE_USER_INFO.gql'
import UPDATE_USER_BILLING from '@/apollo/mutations/user/UPDATE_USER_BILLING.gql'
import UPDATE_USER_SHIPPING from '@/apollo/mutations/user/UPDATE_USER_SHIPPING.gql'

import SEND_CHANGE_USER_PASSWORD from '@/apollo/mutations/user/resetPassword/SEND_CHANGE_USER_PASSWORD.gql'
import SEND_RESET_PASSWORD_EMAIL from '@/apollo/mutations/user/resetPassword/SEND_RESET_PASSWORD_EMAIL.gql'

import CHANGE_USER_PASSWORD from '@/apollo/mutations/user/CHANGE_USER_PASSWORD.gql'
import CHANGE_USER_EMAIL from '@/apollo/mutations/user/CHANGE_USER_EMAIL.gql'
import { useSnackbar } from "@/store/snackbar";
import { useAuth } from '@/store/useAuth.js'

export async function updateUserInfo(userInfo) {
  
  const userInfoVar = {
      input: {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      },
    };
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

      authStore.setRefreshToken(result.data.updateCustomer.refreshToken)
      authStore.setCustomerJwt(result.data.updateCustomer.customer.jwtAuthToken)
      authStore.setToken(result.data.updateCustomer.authToken)

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

      authStore.setRefreshToken(result.data.updateCustomer.refreshToken)
      authStore.setCustomerJwt(result.data.updateCustomer.customer.jwtAuthToken)
      authStore.setToken(result.data.updateCustomer.authToken)

      authStore.setCustomer(customerInfo)

      snackbar.setMessage('Rechnungsadresse aktualisiert', 'success')

    })
}

export async function updateEmail(id, email) {
  const changeEmail = {
    id: id,
    email: email
  };
  const { mutate, onError, onDone } = useMutation(CHANGE_USER_EMAIL, {
    variables: changeEmail
  });

  mutate(changeEmail);
  
  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message, 'error')
  })
  onDone((result) => {
    const snackbar = useSnackbar()

    snackbar.setMessage('E-Mail wurde aktualisiert', 'success');
  })
}

export async function updatePassword(id, password) {
  const changePassword = {
    id: id,
    password: password
  };
  const { mutate, onError, onDone } = useMutation(CHANGE_USER_PASSWORD, {
    variables: changePassword
  });

  mutate(changePassword);
  
  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message, 'error')
  })
  onDone((result) => {
    const snackbar = useSnackbar()

    snackbar.setMessage('Passwort wurde aktualisiert', 'success');
  })
}

export async function sendResetPasswordLink(username) {
  const resetPasswordVar = {
    input: {
      username: username,
    }
  };
  const { mutate, onError, onDone } = useMutation(SEND_RESET_PASSWORD_EMAIL, {
    variables: resetPasswordVar
  });

  mutate(resetPasswordVar);
  
  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message, 'error')
  })
  onDone((result) => {})
}
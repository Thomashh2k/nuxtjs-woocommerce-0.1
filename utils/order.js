import FETCH_ORDERS_QUERY from '@/apollo/queries/FETCH_ORDERS_QUERY.gql'
import { useSnackbar } from "@/store/snackbar";
import { useAuth } from "@/store/useAuth";

export async function getOrders({ search, first, after = null, before = null, last = null, exclude = null}) {
    const orderVar = { search, first, after, before, last, exclude, order: 'ASC' };

    return new Promise((resolve, reject) => {
      debugger
      const { $apolloClient, $wpAuth } = useNuxtApp()
        const result = $apolloClient.query({
          query: FETCH_ORDERS_QUERY,
          variables: orderVar,
          context: { headers: { authorization: `Bearer ${$wpAuth.value}` } }
        }).then((result) => {

          const data = result?.data;
          resolve(data.orders);

        }).catch((error) => {

            const snackbar = useSnackbar()
            snackbar.setMessage(error.message, 'error')
            reject(error)
            
        });
    });
}

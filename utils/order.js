import FETCH_ORDERS_QUERY from '@/apollo/queries/FETCH_ORDERS_QUERY.gql'
import { useSnackbar } from "@/store/snackbar";

export async function getOrders({ search, first, after = null, before = null, last = null, exclude = null}) {
    const orderVar = { search, first, after, before, last, exclude, order: 'ASC' };

    return new Promise((resolve, reject) => {
        debugger
        const authorization = useCookie("authorization");

        const result = useQuery(FETCH_ORDERS_QUERY, orderVar,{
            // This should be Fixed somehow because this should be handled by plugins/apollo.js
            context: { headers: { authorization: `Bearer ${authorization.value}` } }
        });
        result.start();
        result.onError((err) => {
            const snackbar = useSnackbar()
            snackbar.setMessage(err.message, 'error')
        })

        result.onResult((res) => {
            const data = res?.data;
            resolve(data.orders);

        });
    });
}
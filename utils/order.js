import FETCH_ORDERS_QUERY from '@/apollo/queries/FETCH_ORDERS_QUERY.gql'

export async function getOrders({ search, first, after = null, before = null, last = null, exclude = null}) {
    const orderVar = { search, first, after, before, last, exclude };

    return new Promise((resolve, reject) => {
        const result = useQuery(FETCH_ORDERS_QUERY, {}, {
            fetchPolicy: 'cache-and-network',
        });
        
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
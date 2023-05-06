import GET_PAGE_QUERY from '@/apollo/queries/GET_PAGE_QUERY.gql'

export async function getPage(uri) {
    const pageVar = { uri };

    const result = await useAsyncQuery(
        GET_PAGE_QUERY,
        pageVar
    );

    await result.execute();
    const data = result.data.value

    return data
}
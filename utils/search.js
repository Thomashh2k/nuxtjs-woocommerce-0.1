import PRODUCT_MINI_SEARCH_QUERY from "@/apollo/queries/PRODUCT_MINI_SEARCH_QUERY.gql";
import PRODUCT_PAGE_SEARCH_QUERY from "@/apollo/queries/PRODUCT_PAGE_SEARCH_QUERY.gql";
import PRODUCT_PAGE_CATEGORY_SEARCH_QUERY from "@/apollo/queries/PRODUCT_PAGE_CATEGORY_SEARCH_QUERY.gql";

export async function miniSearchProducts(search, first) {
    const searchVar = { search: search, first: first };

    const result = await useAsyncQuery(
        PRODUCT_MINI_SEARCH_QUERY,
        searchVar
    );

    await result.execute();
    const data = result.data.value.products.nodes

    return data
}

export async function pageSearchProducts(search, first, after = null, before = null, last = null, exclude = null) {
    const searchVar = { search, first, after, before, last, exclude };


    

    return new Promise((resolve, reject) => {
      const result = useQuery(PRODUCT_PAGE_SEARCH_QUERY, searchVar, {
        fetchPolicy: 'cache-and-network',
      });
  
      result.onResult((res) => {
        const data = res?.data;
  
        if (data) {
          const pageInfo = data.products.pageInfo;  
          // define a function to load the next page of results
          const loadMore = async (nextPage, pI, ipp, exclude) => {
            debugger
            let resp = null;
            resp = await result.fetchMore({
              variables: {
                after: pI.endCursor,
                last: null,
                first: ipp,
                exclude
              },
            });
            return { data: resp.data, pageInfo: resp.data.products.pageInfo }
          };
  
          // resolve with the initial data and pageInfo
          resolve({ data, pageInfo, loadMore });
        } else {
          reject(new Error('No data found'));
        }
      });
    });
}

export function pageCategorySearchProducts(search, itemsPerPage, cursor, exclude = null) {
    const searchVar = {
      search: search?.query ? search.query : null,
      categoryIn: search?.categoryIn ? search.categoryIn : null,
      first: itemsPerPage?.first ? itemsPerPage.first : null,
      last: itemsPerPage?.last ? itemsPerPage.last : null,
      after: cursor?.after ? cursor.after : null,
      before: cursor?.before ? cursor.before : null,
      exclude
    };
  
    return new Promise((resolve, reject) => {
      const result = useQuery(PRODUCT_PAGE_CATEGORY_SEARCH_QUERY, searchVar, {
        fetchPolicy: 'cache-and-network',
      });
  
      result.onResult((res) => {
        const data = res?.data;
  
        if (data) {
          const pageInfo = data.products.pageInfo;  
          // define a function to load the next page of results
          const loadMore = async (nextPage, pI, ipp, exclude) => {
            debugger
            let resp = null;
            resp = await result.fetchMore({
              variables: {
                after: pI.endCursor,
                last: null,
                first: ipp,
                exclude
              },
            });
            return { data: resp.data, pageInfo: resp.data.products.pageInfo }
          };
  
          // resolve with the initial data and pageInfo
          resolve({ data, pageInfo, loadMore });
        } else {
          reject(new Error('No data found'));
        }
      });
    });
  }

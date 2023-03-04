// 
//  This cant be used bc @nuxt/auth or different packages do not work like expected...
//
// import { LocalScheme } from '~auth/runtime'
// import LOGIN_USER_MUTATION from "@/apollo/mutations/LOGIN_USER_MUTATION.gql";

// export default class GraphQLScheme extends LocalScheme {
//     async login(credentials, { reset = true } = {}) {

//         const {
//             apolloProvider: { defaultClient: apolloClient },
//             $apolloHelpers,
//         } = this.$auth.ctx.app

//         if (reset) {
//         this.$auth.reset({ resetInterceptor: false })
//         }

//         const response = await apolloClient
//         .mutate({
//             mutation: LOGIN_USER_MUTATION,
//             variables: credentials,
//         }).then(({ data }) => data && data.logIn)
    
//         // Update our cookie token
//         this.token.set(response.data.login.authToken)
//         this.$auth.setUser(response.data.user)
        
//         // Set our graphql-token so subsequent graphql request are authenticated
//         await $apolloHelpers.onLogin(response.token)
    
//         // Fetch user
//         await this.fetchUser() // We will define this function next
    
//         return response.token
//     },
//     async logout() {
//         $apolloHelpers.onLogout()
//         return this.$auth.reset({ resetInterceptor: false })
//     }
//     initializeRequestInterceptor() {
//         // Instead of initializing axios interceptors, Do nothing
//         // Since we are not using axios
//     }
//     reset() {
//         this.$auth.setUser(false)
//         this.token.reset()
//     }
// }
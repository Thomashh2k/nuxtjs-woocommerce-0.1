export default defineNuxtRouteMiddleware((to, from) => {  
  // Überprüfe, ob sich der Benutzer auf der Seite "/account" befindet
    if (to.path.includes('/account')) {
      // Überprüfe, ob die JWT-Cookies nicht null sind
      const authorization = useCookie("wp-auth");
      const woocommerceSession = useCookie("woocommerce-session");


      // try {
      //   const authDecodedToken = jwtDecode(authorization.value || '', { header: true })
      //   const woocommerceDecodedToken = jwtDecode(woocommerceSession.value || '', { header: true })
    
      //   // Hier kannst du weitere Prüfungen durchführen, z.B. das Ablaufdatum des Tokens überprüfen
      //   if (authDecodedToken.exp < Date.now() / 1000 || woocommerceDecodedToken.exp < Date.now() / 1000) {
      //     return navigateTo('/', { redirectCode: 401 });
      //   } else {
      //     return
      //   }
      // } catch (error) {

      //   return navigateTo('/', { redirectCode: 401 });
      // }

      if(authorization.value === null || woocommerceSession.value === null) {
        return navigateTo('/', { redirectCode: 401 });
      }

    } else {
      return
    }

})
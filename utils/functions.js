import { uid } from "uid";
import { useCart } from "@/store/useCart";
import { useOrderReceived } from "@/store/useOrderReceived";
import { useSnackbar } from "@/store/snackbar";
import ADD_TO_CART_MUTATION from "@/apollo/mutations/ADD_TO_CART_MUTATION.gql";
import CLEAR_CART from "@/apollo/mutations/CLEAR_CART.gql";
import REMOVE_ITEM_FROM_CART from "@/apollo/mutations/REMOVE_ITEM_FROM_CART.gql";
import CHECKOUT_MUTATION from "@/apollo/mutations/checkouts/CHECKOUT_MUTATION.gql";
import ONECLICK_CHECKOUT_MUTATION from "@/apollo/mutations/checkouts/ONECLICK_CHECKOUT_MUTATION.gql";
import GUEST_CHECKOUT_MUTATIONS from "@/apollo/mutations/checkouts/GUEST_CHECKOUT_MUTATIONS.gql";
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";


/**
 * Strips HTML from the inputted string
 * @param {String} description Input text to strip HTML from
 */
export function stripHTML(string) {
  return string.replace(/<\/?[^>]+(>|$)/gi, "");
}

/**
 * Filter variant price. Changes "kr198.00 - kr299.00" to kr299.00 or kr198 depending on the side variable
 * @param {String} side Which side of the string to return (which side of the "-" symbol)
 * @param {String} price The inputted price that we need to convert
 */
export const filteredVariantPrice = (price, side) => {
  if (side === "right") {
    return price.substring(price.length, price.indexOf("-")).replace("-", "");
  }
  return price.substring(0, price.indexOf("-")).replace("-", "");
};

/**
 * Strips product name from variant name
 * @param {String} productName Text to strip out
 * @param {String} input Input text to strip product name from
 */
export function filteredVariantName(productName, input) {
  return input.replace(`${productName} -`, "");
}

/**
 * Prepares the checkout object based on the input data from the checkout form
 * @param {Object} form Form data to process
 */
export function createCheckoutData(form) {
  return {
    clientMutationId: uid(),
    billing: {
      firstName: form.firstName,
      lastName: form.lastName,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      country: form.country,
      state: form.state,
      postcode: form.postcode,
      email: form.email,
      phone: form.phone,
      company: form.company,
    },
    shipping: {
      firstName: form.firstName,
      lastName: form.lastName,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      country: form.country,
      state: form.state,
      postcode: form.postcode,
      email: form.email,
      phone: form.phone,
      company: form.company,
    },
    shipToDifferentAddress: false,
    paymentMethod: form.paymentMethod,
    isPaid: false,
    transactionId: "test",
  };
}
export function priceToNumber(price) {
  let _price = price.replace('&nbsp;€', '')
  _price = _price.replace(',', '.')
  const test = Number(_price).toFixed(2)
  return Number(_price).toFixed(2)
}
export function wpriceToPrice(price) {
  return price.replace('&nbsp;', ' ')
}
export function numberToPrice(number, currency = '€') {
  
  if(typeof number === 'number') {
    number = number.toFixed(2)
  }
  let _number = number.toString()
  _number = _number.replace('.', ',')
  return _number + currency
}
/**
 * Get specific cookie from document.cookie
 * @param {String} cName Name of cookie to return
 */
export function getCookie(cName) {
  const name = `${cName}=`;
  const cDecoded = decodeURIComponent(document.cookie);
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
export async function addProductToCart (product) {
  const cart = useCart();
  const addTempRes = cart.addTemporary(product);
  const productId = product.databaseId;
  const quantity = 1;
  const addToCartvariables = {
    productId,
    quantity
  };
  
  const { mutate, onError, onDone } = useMutation(ADD_TO_CART_MUTATION, {
    variables: addToCartvariables
  });

  mutate(addToCartvariables);

  onError((err) => {
    const snackbar = useSnackbar()
    cart.removeItem(product);
    if(err.message.includes('Du kannst diese Menge nicht deinem Warenkorb hinzufügen.')) {
      snackbar.setMessage(' Du kannst diese Menge nicht deinem Warenkorb hinzufügen, da wir ein weiteres Examplar von der Ware noch vorrätig haben.', 'error')
    } else {
      snackbar.setMessage(err.message, 'error')
    }
  })
  onDone((result) => {
    debugger
    cart.addDetails(result.data.addToCart.cart);
    cart.addAfterSuccess(result.data.addToCart.cartItem.key, addTempRes);
  })


};

export function removeProductFromCart (product) {
  const cart = useCart();
  cart.removeItem(product);
  
  
  const removeItemsVariables = {
    itemKey: product.key
  };

  const authorization = useCookie("wp-auth");
  const woocommerceSession = useCookie("woocommerce-session");

  const { mutate, onDone, onError } = useMutation(REMOVE_ITEM_FROM_CART, {
    variables: removeItemsVariables.itemKey,
    context: { 
      headers: { 
        authorization: `Bearer ${authorization.value}`,
        'woocommerce-session': `Session ${woocommerceSession.value}`,
      }
    }
  });

  mutate(removeItemsVariables);

  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message, 'error')
  })

  onDone((result) => {
    const snackbar = useSnackbar()
    snackbar.setMessage('Produkt entfernt', 'success')
  })
}

// const api = new WooCommerceRestApi({
//   url: "https://api.og-gaming.store",
//   consumerKey: "ck_edb8770951a27a59f3b12938ee087d00d08f935f",
//   consumerSecret: "cs_e04333cd3e0f91ea38e6fc8268f1a6d2dbc5f215",
//   version: "wc/v3",
// });

export async function checkout(orderData, paymentMethod) {
  // shipping.address1 = shipping.address
  debugger
  const checkoutVariables = {
    input: {
      shipping: orderData.shippingAddress,
      billing: orderData.billingAddress,
      transactionId: orderData.transactionId,
      paymentMethod: paymentMethod,

    }
  };
  if(paymentMethod.includes('stripe')) {
    checkoutVariables.input.metaData = [
      {key: "_stripe_intent_id", value: orderData.transactionId }
    ]
  }

  const woocommerceSession = useCookie("woocommerce-session");
  const authorization = useCookie("wp-auth");


  let cookies = `woocommerce-session=${woocommerceSession.value};`;
  const headers = {
    'Cookie': cookies,
    'woocommerce-session': `Session ${woocommerceSession.value}`,
  }
  if(authorization.value !== null && authorization.value !== undefined) {
    cookies += `Authorization=Bearer ${authorization.value}`;
    headers['Authorization'] = `Bearer ${authorization.value}`;
  }
  const { mutate, onError, onDone } = useMutation(CHECKOUT_MUTATION, {
    variables: checkoutVariables,
    context: { 
      headers: headers
    }
  });
  // debugger
  // const resp = await api.post("orders", checkoutVariables)
  mutate(checkoutVariables);
  // return resp
  return { onDone, onError }


}

export async function recreateCart(cartItems) {
  const cart = useCart();
  cart.clear();
  debugger

  for (let i = 0; i < cartItems.length; i++) {
    const cartVariables = {
      productId: cartItems[i].product.databaseId,
      quantity: cartItems[i].quantity
    }
    const addTempRes = cart.addTemporary(cartItems[i].product);

    const { mutate, onError, onDone } = useMutation(ADD_TO_CART_MUTATION, {
      variables: cartVariables
    });
    mutate(cartVariables);

    onError((err) => {
      const snackbar = useSnackbar()
      if(err.message.includes('Du kannst diese Menge nicht deinem Warenkorb hinzufügen.')) {
        snackbar.setMessage(' Du kannst diese Menge nicht deinem Warenkorb hinzufügen, da wir ein weiteres Examplar von der Ware noch vorrätig haben.', 'error')
      } else {
        snackbar.setMessage(err.message, 'error')
      }
    })
    onDone((result) => {
      debugger
      cart.addDetails(result.data.addToCart.cart);
      cart.addAfterSuccess(result.data.addToCart.cartItem.key, addTempRes);
    })

  }
}

export async function oneClickCheckout(productID, shipping, billing, paymentMethod) {
  // shipping.address1 = shipping.address
  
  const checkoutVariables = {
    input: {
      productId: productID,
      quantity: 1,
      shipping: shipping,
      billing: billing,
      paymentMethod: paymentMethod,
    }
  };
  const { mutate, onError, onDone } = useMutation(ONECLICK_CHECKOUT_MUTATION, {
    variables: checkoutVariables
  });

  mutate(checkoutVariables);

  return { onDone, onError }
} 

export function getOrderStatus (status, obj) {
  if(status === 'FAILED') {
    return 'Fehlgeschlagen'
  } else if(status === 'COMPLETED') {
    return 'Abgeschlossen'
  } else if(status === 'PROCESSING') {
    return 'In Bearbeitung'
  } else if(status === 'PENDING'){
    return 'Ausstehend'
  } else if(status === 'REFUNDED') {
    return 'Rückerstattet'
  } else if(status === 'CANCELLED') {
    return 'Abgebrochen'
  } else if(status === 'ON_HOLD') {
    return 'In Wartestellung'
  }
}


// const api = new WooCommerceRestApi({
//   url: "https://your-woocommerce-site.com",
//   consumerKey: "your-consumer-key",
//   consumerSecret: "your-consumer-secret",
//   version: "wc/v3",
// });

// // Clear cart
// const clearCart = async () => {
//   try {
//     const response = await api.post("clear_cart", {});
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Add to cart
// const addToCart = async (productId, quantity) => {
//   try {
//     const response = await api.post("add_to_cart", {
//       product_id: productId,
//       quantity: quantity,
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Remove item from cart
// const removeItemFromCart = async (itemId) => {
//   try {
//     const response = await api.delete(`remove_item_from_cart/${itemId}`);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Checkout
// const checkout = async (checkoutData) => {
//   try {
//     const response = await api.post("checkout", checkoutData);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // One-click checkout
// const oneClickCheckout = async (productId) => {
//   try {
//     const response = await api.post("one_click_checkout", {
//       product_id: productId,
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// // Guest checkout
// const guestCheckout = async (checkoutData) => {
//   try {
//     const response = await api.post("guest_checkout", checkoutData);
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };
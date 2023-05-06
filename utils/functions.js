import { uid } from "uid";
import { useCart } from "@/store/useCart";
import { useOrderReceived } from "@/store/useOrderReceived";
import { useSnackbar } from "@/store/snackbar";

import ADD_TO_CART_MUTATION from "@/apollo/mutations/ADD_TO_CART_MUTATION.gql";
import REMOVE_ITEM_FROM_CART from "@/apollo/mutations/REMOVE_ITEM_FROM_CART.gql";
import CHECKOUT_MUTATION from "@/apollo/mutations/CHECKOUT_MUTATION.gql";
import { string } from "yup";

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
    if(err.message.includes('<a href="http://localhost:8080" class="button wc-forward">Warenkorb anzeigen</a> Du kannst diese Menge nicht deinem Warenkorb hinzufügen.')) {
      snackbar.setMessage(' Du kannst diese Menge nicht deinem Warenkorb hinzufügen, da wir ein weiteres Examplar von der Ware noch vorrätig haben.')
    } else {
      snackbar.setMessage(err.message)
    }
  })
  onDone((result) => {
    
    cart.addToCart(product);
    cart.addCartId(result.data.addToCart.cartItem.key);
    cart.addCartDetails(result.data.addToCart.cart);
  })


};

export function removeProductFromCart (content) {
  const cart = useCart();
  cart.removeProductFromCart(content);
  
  const removeItemsVariables = {
    cartKey: [cart.getCartId],
  };
  const { mutate, onError } = useMutation(REMOVE_ITEM_FROM_CART, {
    variables: removeItemsVariables
  });

  mutate(removeItemsVariables);

  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message)
  })
  // onError((err) => {
  //   if()
  // })
}

export async function checkout(shipping, paymentMethod, transactionId, shippingMethod, billing, router) {
  shipping.address1 = shipping.address
  delete shipping.zipCode
  delete shipping.address
  if(billing == undefined) {
    billing = shipping
  }
  const checkoutVariables = {
    input: {
      shipping: shipping,
      billing: billing,
      transactionId: transactionId,
      paymentMethod: paymentMethod,
      shippingMethod: shippingMethod,
    }
  };
  const { mutate, onError, onDone } = useMutation(CHECKOUT_MUTATION, {
    variables: checkoutVariables
  });

  mutate(checkoutVariables);

  onError((err) => {
    const snackbar = useSnackbar()
    snackbar.setMessage(err.message)
  })
  onDone((res) => {
    const orderReceivedStore = useOrderReceived();
    orderReceivedStore.setOrder(res.data.checkout.order)
    navigateTo('/order-received')
  })
} 
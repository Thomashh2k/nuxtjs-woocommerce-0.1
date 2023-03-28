import { uid } from "uid";
import { useCart } from "@/store/useCart";

import ADD_TO_CART_MUTATION from "@/apollo/mutations/ADD_TO_CART_MUTATION.gql";
import REMOVE_ITEM_FROM_CART from "@/apollo/mutations/REMOVE_ITEM_FROM_CART.gql";
import CHECKOUT_MUTATION from "@/apollo/mutations/CHECKOUT_MUTATION.gql";

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
  
  const { mutate, onError } = useMutation(ADD_TO_CART_MUTATION, {
    variables: addToCartvariables
  });
  
  const result = await mutate(addToCartvariables);
  debugger

  const obj = {
    product: product,
    cartKey: result.data.addToCart.cartItem.key
  }
  cart.addToCart(obj);
  let notAvailable
  debugger
  notAvailable = onError((err) => {
  debugger

    if(err.message.includes('Du kannst diese Menge nicht deinem Warenkorb hinzufügen.')) {
      return err
    } else {
      return false
    }
  })
  debugger
  return notAvailable
};

export function removeProductFromCart (content) {
  debugger
  const cart = useCart();
  cart.removeProductFromCart(content);
  const removeItemsVariables = {
    databaseId: [content.key],
  };
  const { mutate, onError } = useMutation(REMOVE_ITEM_FROM_CART, {
    variables: removeItemsVariables
  });

  mutate(removeItemsVariables);
  // onError((err) => {
  //   if()
  // })
}

export async function checkout(shipping, paymentMethod, shippingMethod, billing) {

  if(billing == undefined) {
    billing = shipping
  }

  const checkoutVariables = {
    shipping: shipping,
    billing: billing,
    paymentMethod: paymentMethod,
    shippingMethod: shippingMethod,
  };

  const { mutate } = useMutation(CHECKOUT_MUTATION, {
    variables: checkoutVariables
  });

  mutate(checkoutVariables);

} 
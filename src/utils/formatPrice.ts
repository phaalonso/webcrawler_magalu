export default {
	stringToPrice(price: string) {
	  const formatedPrice = price.replace(".", "").replace(",", ".");

	  return parseFloat(formatedPrice);
	},
}

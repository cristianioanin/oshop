import { ShoppingCartItem } from './shopping-cart-item';
import { Product } from './product';

export class ShoppingCart {
	items: ShoppingCartItem[] = [];

	constructor(private itemsMap: { [productId: string]: ShoppingCartItem } = {}) {
		for (let productId in itemsMap) {
			let item = itemsMap[productId];
			this.items.push(
				new ShoppingCartItem({
					...item,
					$key: productId
				})
			);
		}
	}

	getQuantity(product: Product) {
		let item = this.itemsMap[product.$key];
		return item ? item.quantity : 0;
	}

	get totalItemsCount() {
		let count = 0;
		for (let productId in this.itemsMap) {
			count += this.itemsMap[productId].quantity;
		}
		return count;
	}

	get totalPrice() {
		return this.items.reduce((acc, current) => acc + current.totalPrice, 0);
	}
}

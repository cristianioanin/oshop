import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from './models/product';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { ShoppingCart } from './models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ShoppingCartService {
	constructor(private db: AngularFireDatabase) {}

	async getCart(): Promise<Observable<ShoppingCart>> {
		let cartId = await this.readOrCreateCartId();
		return this.db.object(`/shopping-carts/${cartId}`).map(cart => new ShoppingCart(cart.items));
	}

	async addToCart(product: Product) {
		this.updateItem(product, 1);
	}

	async removeFromCart(product: Product) {
		this.updateItem(product, -1);
	}

	async clearCart() {
		let cartId = await this.readOrCreateCartId();
		this.db.object(`/shopping-carts/${cartId}/items`).remove();
	}

	private create() {
		return this.db.list('shopping-carts').push({
			dateCreated: new Date().getTime()
		});
	}

	private getItem(cartId: string, productId: string) {
		return this.db.object(`/shopping-carts/${cartId}/items/${productId}`);
	}

	private async readOrCreateCartId(): Promise<string> {
		let cartId = localStorage.getItem('oshopCartId');
		if (cartId) return cartId;

		let result = await this.create();
		localStorage.setItem('oshopCartId', result.key);
		return result.key;
	}

	private async updateItem(product: Product, change: number) {
		let cartId = await this.readOrCreateCartId();
		let item$ = this.getItem(cartId, product.$key);
		item$.take(1).subscribe(item => {
			let quantity = (item.quantity || 0) + change;
			if (quantity === 0) {
				item$.remove();
			} else {
				item$.update({
					title: product.title,
					imageUrl: product.imageUrl,
					price: product.price,
					quantity: quantity
				});
			}
		});
	}
}

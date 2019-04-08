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

	private create() {
		return this.db.list('shopping-carts').push({
			dateCreated: new Date().getTime()
		});
	}

	async getCart(): Promise<Observable<ShoppingCart>> {
		let cartId = await this.readOrCreateCartId();
		return this.db.object(`/shopping-carts/${cartId}`).map(cart => new ShoppingCart(cart.items));
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

	async addToCart(product: Product) {
		this.updateItemQuantity(product, 1);
	}

	async removeFromCart(product: Product) {
		this.updateItemQuantity(product, -1);
	}

	private async updateItemQuantity(product: Product, change: number) {
		let cartId = await this.readOrCreateCartId();
		let item$ = this.getItem(cartId, product.$key);
		item$.take(1).subscribe(item => {
			item$.update({ product: product, quantity: (item.quantity || 0) + change });
		});
	}
}

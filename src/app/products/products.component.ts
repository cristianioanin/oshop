import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import 'rxjs/add/operator/switchMap';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: [ './products.component.css' ]
})
export class ProductsComponent implements OnInit, OnDestroy {
	products: Product[] = [];
	filteredProducts: Product[] = [];
	selectedCategory: string;
	cart: any;
	subscription: Subscription;

	constructor(productService: ProductService, route: ActivatedRoute, private shoppingCartService: ShoppingCartService) {
		productService
			.getAll()
			.switchMap(prods => {
				this.products = <Product[]>prods;
				return route.queryParamMap;
			})
			.subscribe(params => {
				this.selectedCategory = params.get('category');
				this.filteredProducts = this.selectedCategory
					? this.products.filter(prod => prod.category === this.selectedCategory)
					: this.products;
			});
	}

	async ngOnInit() {
		this.subscription = (await this.shoppingCartService.getCart()).subscribe(cart => (this.cart = cart));
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

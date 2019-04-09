import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import 'rxjs/add/operator/switchMap';
import { ShoppingCartService } from '../shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: [ './products.component.css' ]
})
export class ProductsComponent implements OnInit {
	products: Product[] = [];
	filteredProducts: Product[] = [];
	selectedCategory: string;
	cart$: Observable<ShoppingCart>;

	constructor(
		private productService: ProductService,
		private route: ActivatedRoute,
		private shoppingCartService: ShoppingCartService
	) {}

	async ngOnInit() {
		this.cart$ = await this.shoppingCartService.getCart();
		this.populateProducts();
	}

	private populateProducts() {
		this.productService
			.getAll()
			.switchMap(prods => {
				this.products = <Product[]>prods;
				return this.route.queryParamMap;
			})
			.subscribe(params => {
				this.selectedCategory = params.get('category');
				this.applyFilter();
			});
	}

	private applyFilter() {
		this.filteredProducts = this.selectedCategory
			? this.products.filter(prod => prod.category === this.selectedCategory)
			: this.products;
	}
}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: [ './products.component.css' ]
})
export class ProductsComponent implements OnInit {
	products: Product[] = [];
	filteredProducts: Product[] = [];
	selectedCategory: string;

	constructor(productService: ProductService, route: ActivatedRoute) {
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

	ngOnInit() {}
}

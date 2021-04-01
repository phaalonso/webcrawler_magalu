export class Produto {
	name!: string;
	price!: number;
	priceInCash!: number;
	avaiability!: boolean;
	image_primary!: string;
	url!: string;

	toString() {
		return JSON.stringify(this);
	}
}

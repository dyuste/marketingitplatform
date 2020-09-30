import Price from 'shared/entities/common/Price'

export default class ProductService {
	static getProductTypePrice(productType) {
		switch (productType) {
			case 'landing': return new Price(14.99);
			case 'microsite': return new Price(4.99);
		}
	}
}

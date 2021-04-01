import {celebrate, Joi, Segments} from 'celebrate';
import {Produto} from './model/Produto';
import { Router } from 'express';
import https from 'https';
import cheerio from 'cheerio';

const routes = Router();

routes.get('/status', (_, res) => {
	res.status(200).send("Ok");
});

routes.post('/status', 
	celebrate({
		[Segments.BODY]: Joi.object().keys({
			url: Joi.string().required().uri()
		})
	}),
	async (req, res) => {
	const { url } = req.body;

	https.get(url.trim(), response => {
		let data = '';

		response.on('data', chunk => data += chunk);

		response.on('close', () => {
			const selector = cheerio.load(data);

			const produto = new Produto();

			produto.url = url;
			const produtoNameString = selector('body').find('h1.header-product__title').text();

			if (!produtoNameString) {
				return res.status(204).json({ message: 'Não foi encontrado um produto nessa url' });
			}

			produto.name = produtoNameString.trim();

			console.log(produto.name);
			produto.image_primary = selector('body').find('img.showcase-product__big-img').attr()?.src;

			const priceSelector = selector('div.price-template');

			let priceFrom = priceSelector.find('div.price-template__from')
				.text()
				.split(' ')[2];

			const priceFromSpan = parseFloat(priceSelector
				.find('span.price-template__text')
				.text()
				.replace('.', '')
				.replace(',', '.')
			);

			if (!priceFrom) {
				produto.price = priceFromSpan;
			} else {
				priceFrom.trim()
					.replace('.', '') // Remove os pontos do preco
					.replace(',', '.'); // Normaliza o preço no formato americano

				produto.price = parseFloat(priceFrom);
				produto.priceInCash = priceFromSpan;
			}

			produto.avaiability = true;

			return res.json(produto)

		});
	});

});

export default routes;

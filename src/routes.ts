import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import { crawler } from "./services/Crawler";

const routes = Router();

// Como é uma única rota, eu deixei elas juntas neste arquivo

routes.get("/status", (_, res) => {
  res.status(200).send("Ok");
});

routes.post(
  "/status",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      url: Joi.string().required().uri(),
    }),
  }),
  async (req, res) => {
    const { url } = req.body;

    const produto = await crawler.extrairProduto(url);

    if (produto) {
	  //console.log(produto);
      res.json(produto);
    } else {
      // Teve sucesso no crawling, mas o produto não foi encontrado
      res
        .status(204)
        .json({
          message: `Não foi possível encontrar o produto na url: ${url}`,
        });
    }
  }
);

export default routes;

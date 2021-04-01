import https from "https";
import cheerio from "cheerio";
import { Produto } from "../model/Produto";
import priceFormat from "../utils/formatPrice";

class Crawler {
  public extrairProduto(url: string): Promise<Produto | null> {
    return new Promise<Produto | null>((resolve, reject) => {
      https.get(url.trim(), (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));

        res.on("error", (err) => reject(err));

        res.on("close", () => {
          const selector = cheerio.load(data);

          const produto = new Produto();

          produto.image_primary = selector("body")
            .find("img.showcase-product__big-img")
            .attr()?.src;

          produto.avaiability = true;

          produto.url = url;
          let produtoNameString = selector("body")
            .find("h1.header-product__title")
            .text();

          if (!produtoNameString) {
            const unavailableProdut = selector("body")
              .find("h1.header-product__title--unavailable")
              .text();

            if (!unavailableProdut) {
              return resolve(null);
            }

			produto.name = unavailableProdut;
            produto.avaiability = false;
            return resolve(produto);
          }

          // Se não encontrou o nome, então não há produto
          if (!produtoNameString) {
            return resolve(null);
          }

          produto.name = produtoNameString.trim();

          this.extractPrice(produto, selector);

          return resolve(produto);
        });
      });
    });
  }

  private extractPrice(produto: Produto, selector: cheerio.Root) {
    const priceSelector = selector("div.price-template");

    let priceFrom = priceSelector
      .find("div.price-template__from")
      .text()
      .split(" ")[2];

    const priceFromSpan = priceFormat.stringToPrice(
      priceSelector.find("span.price-template__text").text()
    );

    if (!priceFrom) {
      produto.price = priceFromSpan;
    } else {
      produto.price = priceFormat.stringToPrice(priceFrom);
      produto.priceInCash = priceFromSpan;
    }
  }
}

export const crawler = new Crawler();

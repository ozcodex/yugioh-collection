const http = require("http");
const https = require("https");

function responseHandler(response, resolve, reject) {
  const statusCode = response.statusCode;
  if (statusCode < 200 || statusCode >= 300) {
    return reject(new Error(`Request Error Code: ${statusCode}`));
  }

  const parts = [];
  response.on("data", (chunk) => {
    parts.push(chunk);
  });

  response.on("error", reject);

  response.on("end", () => {
    const data = JSON.parse(Buffer.concat(parts).toString());
    resolve(data);
  });
}

function getPricingInfo(id) {
  const path = "http://yugiohprices.com/api/price_for_print_tag/" + id;
  return new Promise((resolve, reject) => {
    http.get(path, (response) => responseHandler(response, resolve, reject));
  });
}

function getCardInfo(name) {
  const path = "https://db.ygoprodeck.com/api/v7/cardinfo.php?name=" + name;
  return new Promise((resolve, reject) => {
    https.get(path, (response) => responseHandler(response, resolve, reject));
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase;
}

module.exports.data = (id) => {
  const data = {};
  return getPricingInfo(id)
    .then((pricing_info) => {
      data.id = id;
      data.name = pricing_info.data.name;
      data.set_name = pricing_info.data.price_data.name;
      data.rarity = pricing_info.data.price_data.rarity;
      data.average_price =
        pricing_info.data.price_data.price_data.data.prices.average;
      return getCardInfo(data.name);
    })
    .then((card_info) => {
      data.type = card_info.data[0].type;
      data.description = card_info.data[0].desc;
      data.atk = card_info.data[0].atk;
      data.def = card_info.data[0].def;
      data.level = card_info.data[0].level;
      data.attribute = card_info.data[0].attribute;
      data.archetype = card_info.data[0].archetype;
      data.image_url = card_info.data[0].card_images[0]?.image_url

      return data;
    });
};

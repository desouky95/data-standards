"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
class Scrapper {
    constructor() { }
    async getData({ cb, url }) {
        const response = await axios_1.default.get(url);
        const $ = (0, cheerio_1.load)(response.data);
        cb($);
    }
}
exports.default = Scrapper;

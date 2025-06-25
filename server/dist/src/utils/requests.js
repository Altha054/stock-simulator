"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchStocks = exports.fetchStockData = void 0;
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const node_cache_1 = __importDefault(require("node-cache"));
const stockCache = new node_cache_1.default({ stdTTL: 60 }); // 1 minute
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fetchStockData = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = symbol + "-quote";
    try {
        if (stockCache.has(cacheKey)) {
            return stockCache.get(cacheKey);
        }
        else {
            const quote = yield yahoo_finance2_1.default.quoteCombine(symbol, {
                fields: [
                    "regularMarketPrice",
                    "regularMarketChangePercent",
                    "longName",
                    "regularMarketPreviousClose",
                ],
            });
            const { regularMarketPrice, regularMarketChangePercent, longName, regularMarketPreviousClose, } = quote;
            const stockData = {
                symbol,
                longName,
                regularMarketPrice,
                regularMarketPreviousClose,
                regularMarketChangePercent,
            };
            stockCache.set(cacheKey, stockData);
            return stockData;
        }
    }
    catch (err) {
        if (err.result && Array.isArray(err.result)) {
            let quote = err.result[0];
            const { regularMarketPrice, regularMarketChangePercent, longName, regularMarketPreviousClose, } = quote;
            const stockData = {
                symbol,
                longName,
                regularMarketPrice,
                regularMarketPreviousClose,
                regularMarketChangePercent,
            };
            stockCache.set(cacheKey, stockData);
            return stockData;
        }
        else {
            console.error(err);
            console.error("Error fetching " + symbol + " stock data:", err);
            throw new Error(err);
        }
    }
});
exports.fetchStockData = fetchStockData;
const searchStocks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryOptions = {
        newsCount: 0,
        enableFuzzyQuery: true,
        enableNavLinks: false,
        enableCb: false,
        enableEnhancedTrivialQuery: false,
    };
    return yahoo_finance2_1.default
        .search(query, queryOptions)
        .then((results) => {
        return results.quotes;
    })
        .catch((err) => {
        if (err.result && Array.isArray(err.result.quotes)) {
            return err.result.quotes;
        }
        else {
            console.error(err);
            throw new Error(err);
        }
    });
});
exports.searchStocks = searchStocks;

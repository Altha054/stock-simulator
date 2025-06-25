"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCryptoSymbol = exports.CRYPTO_PATTERNS = exports.EXCLUDED_QUOTE_TYPES = exports.ENABLED_ASSET_TYPES = exports.AssetType = void 0;
var AssetType;
(function (AssetType) {
    AssetType["EQUITY"] = "EQUITY";
    AssetType["INDEX"] = "INDEX";
    AssetType["ETF"] = "ETF";
    AssetType["MUTUAL_FUND"] = "MUTUAL_FUND";
})(AssetType || (exports.AssetType = AssetType = {}));
exports.ENABLED_ASSET_TYPES = new Set([
    AssetType.EQUITY,
    AssetType.INDEX,
    AssetType.ETF,
    AssetType.MUTUAL_FUND
]);
exports.EXCLUDED_QUOTE_TYPES = new Set([
    'CRYPTOCURRENCY',
    'CRYPTO',
    'CURRENCY',
    'FUTURE',
    'FUTURES'
]);
exports.CRYPTO_PATTERNS = [
    /-USD$/i,
    /-EUR$/i,
    /-JPY$/i,
    /-GBP$/i,
    /^BTC-/i,
    /^ETH-/i,
    /^XRP-/i,
    /^DOGE-/i,
    /^ADA-/i,
    /USDT$/i,
    /^USDC/i,
    /BUSD$/i,
    /USDD$/i
];
const isCryptoSymbol = (symbol) => {
    if (!symbol)
        return false;
    const upperSymbol = symbol.toUpperCase();
    return exports.CRYPTO_PATTERNS.some(pattern => pattern.test(upperSymbol));
};
exports.isCryptoSymbol = isCryptoSymbol;

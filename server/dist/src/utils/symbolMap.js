"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// symbolMap.ts
const symbolMap = {
    // US Major Indices
    "%5EGSPC": "FOREXCOM:SPXUSD",
    "%5EDJI": "FOREXCOM:DJI",
    "^DJI": "FOREXCOM:DJI",
    "%5EIXIC": "NASDAQ:IXIC",
    "%5ERUT": "FOREXCOM:RUSUSD",
    "%5EVIX": "TVC:VIX",
    // US Large Cap Tech
    "AAPL": "NASDAQ:AAPL",
    "MSFT": "NASDAQ:MSFT",
    "GOOGL": "NASDAQ:GOOGL",
    "AMZN": "NASDAQ:AMZN",
    "META": "NASDAQ:META",
    "NVDA": "NASDAQ:NVDA",
    "TSLA": "NASDAQ:TSLA",
    // US Financial
    "JPM": "NYSE:JPM",
    "BAC": "NYSE:BAC",
    "WFC": "NYSE:WFC",
    "GS": "NYSE:GS",
    "MS": "NYSE:MS",
    // US Industrial & Retail
    "WMT": "NYSE:WMT",
    "HD": "NYSE:HD",
    "CAT": "NYSE:CAT",
    "BA": "NYSE:BA",
    "GE": "NYSE:GE",
    // European Blue Chips
    "SIE.DE": "XETR:SIE",
    "ASML.AS": "EURONEXT:ASML",
    "SAP.DE": "XETR:SAP",
    "AIR.PA": "EURONEXT:AIR",
    // Asian Markets
    "7203.T": "TSE:7203",
    "9984.T": "TSE:9984",
    "005930.KS": "KRX:005930",
    "0700.HK": "HKEX:0700",
    "9988.HK": "HKEX:9988",
    // Market ETFs
    "SPY": "AMEX:SPY",
    "QQQ": "NASDAQ:QQQ",
    "DIA": "AMEX:DIA",
    "IWM": "AMEX:IWM",
    "VGK": "AMEX:VGK",
    "EWJ": "AMEX:EWJ", // Japanese Stocks ETF
};
exports.default = symbolMap;

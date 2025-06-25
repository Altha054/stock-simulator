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
const user_model_1 = __importDefault(require("../models/user.model"));
const requests_1 = require("../utils/requests");
// Remove the caching mechanism for live data
const getLeaderboard = (req, res) => {
    /*
    #swagger.tags = ['Leaderboard']
    */
    // Fetch live leaderboard data (all users)
    getLeaderboardAllUsers()
        .then((users) => {
        res.status(200).send({ users });
    })
        .catch((err) => {
        res.status(500).send({ message: err.message });
    });
};
// Function to get data for all users
function getLeaderboardAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Collate all unique stock symbols from users' positions using Aggregation
        const symbolsAggregation = yield user_model_1.default.aggregate([
            { $unwind: "$positions" },
            { $group: { _id: "$positions.symbol" } },
        ]);
        const uniqueSymbols = symbolsAggregation.map((entry) => entry._id);
        // 2. Fetch stock prices in a single batch request
        const stockDataPoints = yield Promise.all(Array.from(uniqueSymbols).map((symbol) => (0, requests_1.fetchStockData)(symbol)));
        const stockPrices = {};
        stockDataPoints.forEach((dataPoint) => {
            stockPrices[dataPoint.symbol] = dataPoint.regularMarketPrice;
        });
        // 3. Compute portfolio values for each user using projection
        const usersWithPositions = yield user_model_1.default.find({}, { username: 1, positions: 1, cash: 1 });
        const userValues = [];
        usersWithPositions.forEach((user) => {
            let totalValue = user.cash;
            user.positions.forEach((position) => {
                const currentPrice = stockPrices[position.symbol];
                totalValue += currentPrice * position.quantity;
            });
            userValues.push({ username: user.username, value: totalValue });
        });
        // Return the full list of users, sorted by their portfolio value
        userValues.sort((a, b) => b.value - a.value);
        return userValues; // All users with their portfolio values
    });
}
exports.default = { getLeaderboard };

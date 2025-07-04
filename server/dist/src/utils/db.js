"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
require("dotenv").config();
// Read password from dotenv file
const password = process.env.STOTRA_MONGODB_PASSWORD;
const uri = "mongodb+srv://" +
    process.env.STOTRA_MONGODB_USERNAME +
    ":" +
    password +
    "@" +
    process.env.STOTRA_MONGODB_CLUSTER +
    "/users?authMechanism=DEFAULT&retryWrites=true&w=majority";
mongoose_1.default.connect(uri);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to Database");
});
module.exports = db;

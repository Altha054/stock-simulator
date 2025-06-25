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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.STOTRA_JWT_SECRET;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const axios_1 = __importDefault(require("axios"));
const inappropriateWords = [
    "Fent", "fenttweaker", "fentanyl", "benjaminnetanyahu", "netanyahu", "adolfhitler", "adolf", "hitler", "putain", "merde", "taguele", "conne", "hmar", "sharmoot", "sharmoota", "sharmootah", "gazma", "kosomak", "kos", "alphakennybody", "mikeox", "nillkiggers", "kneegrow", "mikehawk", "nate higgers", "asshole", "bitch", "bastard", "dickhead", "fuck", "motherfucker", "shit", "cunt", "cock", "pussy",
    "prick", "whore", "slut", "faggot", "dyke", "bimbo", "hoe", "ass", "bimbo", "jackass", "twat",
    "douche", "douchebag", "sonofabitch", "bastards", "fucker", "shitter", "cockhead", "cum", "cumshot",
    "clit", "vagina", "penis", "dildo", "bukkake", "orgasm", "rapist", "pedophile", "incest", "zoophilia",
    "necrophilia", "bestiality", "heroin", "meth", "crackhead", "crack", "smackhead", "junkie", "stoner",
    "methhead", "addict", "homo", "queer", "tranny", "transvestite", "whorehouse", "brothel", "hooker",
    "escort", "gigolo", "gimp", "retard", "moron", "imbecile", "stupid", "dumbass", "dumbfucker", "fuckhead",
    "fucktard", "cockslut", "asslips", "fistfuck", "cockblock", "shithead", "ballbuster", "slutty", "bastardized",
    "cockknocker", "fuckboy", "wanker", "cocksucker", "arsehole", "buttfuck", "shitstain", "skank", "cumwhore",
    "fag", "homoerotic", "nigger", "spic", "chink", "gook", "sandnigger", "wetback", "kike", "cracker",
    "yellowman", "redneck", "hillbilly", "guido", "yankee", "slave", "honky", "faggotass", "dickhead",
    "poof", "freak", "mongoloid", "scumbag", "clownfucker", "dickweed", "asswipe", "dickfart", "pisshead",
    "numbnuts", "shitbag", "poophole", "gash", "douchefucker", "pissfuck", "fartknocker", "bitchass",
    "dickbrain", "assclown", "fatass", "cowfuck", "twink", "bitchface", "shitmuncher", "cuntlicker",
    "dirtywhore", "filthfreak", "cumfreak", "crotchlicker", "pussylicker", "cumdumpster", "shitfucker"
];
// Add more inappropriate words here
const isUsernameAppropriate = (username) => {
    const lowerCasedUsername = username.toLowerCase();
    return !inappropriateWords.some((word) => lowerCasedUsername.includes(word));
};
const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};
const signup = (req, res) => {
    /*
    #swagger.tags = ['Authentication']
    */
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
    }
    // Step 1: Validate email format
    if (!isValidEmail(req.body.email)) {
        res.status(400).send({ message: "Invalid email format!" });
        return;
    }
    // Step 2: Check if the email is already registered
    user_model_1.default.findOne({ email: req.body.email })
        .then((existingUser) => {
        if (existingUser) {
            res.status(400).send({ message: "Email is already registered!" });
            return;
        }
        // Step 3: Create new user if email is valid and not already taken
        const newUser = new user_model_1.default({
            email: req.body.email,
            username: req.body.username,
            password: bcryptjs_1.default.hashSync(req.body.password, 8),
            watchlist: [],
            ledger: [],
            positions: [],
            cash: 30000,
        });
        newUser
            .save()
            .then(() => {
            res.status(200).send({ message: "User was registered successfully!" });
        })
            .catch((err) => {
            res.status(500).send({ message: err.message });
        });
    })
        .catch((err) => {
        res.status(500).send({ message: "Error checking email in database" });
    });
};
const login = (req, res) => {
    /*
    #swagger.tags = ['Authentication']
    */
    validateTurnstile(req.body["cf-turnstile-response"])
        .then((_) => {
        user_model_1.default.findOne({
            username: req.body.username,
        })
            .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            var passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Incorrect password",
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, jwtSecret, {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                expiresIn: "7 days",
            });
            res.status(200).send({
                id: user._id,
                username: user.username,
                accessToken: token,
            });
        })
            .catch((err) => {
            res.status(500).send({ message: err.message });
        });
    })
        .catch((err) => {
        res.status(400).send({ message: err.message });
        return;
    });
};
// New forgotPassword function
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    #swagger.tags = ['Authentication']
    */
    const { email, username, newPassword, confirmNewPassword } = req.body;
    // Ensure all required fields are provided
    if (!email || !username || !newPassword || !confirmNewPassword) {
        return res.status(400).send({ message: "All fields are required." });
    }
    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
        return res.status(400).send({ message: "Passwords do not match." });
    }
    try {
        // Find user by email and username
        const user = yield user_model_1.default.findOne({ email, username });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        // Hash the new password
        const hashedPassword = bcryptjs_1.default.hashSync(newPassword, 8);
        user.password = hashedPassword;
        // Save updated password
        yield user.save();
        return res.status(200).send({ message: "Password updated successfully." });
    }
    catch (err) {
        return res.status(500).send({ message: "Error updating password." });
    }
});
const validateTurnstile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    /*
    #swagger.tags = ['Authentication']
    */
    let secret = process.env.STOTRA_TURNSTILE_SECRET;
    if (!secret) {
        throw new Error("Turnstile secret not found");
    }
    let res = yield axios_1.default
        .post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        secret: process.env.STOTRA_TURNSTILE_SECRET,
        response: token,
    })
        .catch((err) => {
        throw new Error(err);
    });
    if (res.data.success) {
        return true;
    }
    else {
        throw new Error("Can't validate turnstile token: " + res.data["error-codes"]);
    }
});
exports.default = { signup, login, forgotPassword };

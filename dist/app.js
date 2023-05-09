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
const twitter_api_v2_1 = require("twitter-api-v2");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_KEY_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
};
const client = new twitter_api_v2_1.TwitterApi(config);
const rwClient = client.readWrite;
const v2Client = rwClient.v2;
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    const apiData = yield response.json();
    const { url, explanation, title, copyright } = apiData;
    const imageData = yield fetch(url);
    const buffer = yield imageData.arrayBuffer();
    const mediaId = yield client.v1.uploadMedia(Buffer.from(buffer), { mimeType: 'image/jpg' });
    return [mediaId, explanation, title, copyright];
});
const postTweet = () => __awaiter(void 0, void 0, void 0, function* () {
    const [mediaId, explanation, title, copyright] = yield fetchData();
    const thread = [];
    for (let i = 0; i < explanation.length; i = i + 280) {
        thread.push(explanation.substr(i, 280));
    }
    ;
    const createdTweet = yield v2Client.tweetThread([{ text: `"${title}" by ${copyright}`, media: { media_ids: [mediaId] } }, ...thread]);
});
postTweet();

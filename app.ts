import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  appKey: process.env.CONSUMER_KEY!,
  appSecret: process.env.CONSUMER_KEY_SECRET!,
  accessToken: process.env.ACCESS_TOKEN!,
  accessSecret: process.env.ACCESS_TOKEN_SECRET!,
};

const client = new TwitterApi(config);
const rwClient = client.readWrite;
const v2Client = rwClient.v2;

const postTweet = async () => {
    const createdTweet = await v2Client.tweet('Hello World!');
};
postTweet();
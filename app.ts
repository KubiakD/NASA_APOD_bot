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

const fetchData = async () => {
  const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
  const apiData = await response.json();
  const {url, explanation, title, copyright} = apiData;
  const imageData = await fetch(url);
  const buffer = await imageData.arrayBuffer();
  const mediaId = await client.v1.uploadMedia(Buffer.from(buffer),{mimeType: 'image/jpg'});
  return [mediaId, explanation, title, copyright];
};
const postTweet = async () => {
  const [mediaId, explanation, title, copyright] = await fetchData();
  const words = explanation.split(' ');
  let thread = [''];
  for (let i = 0; i < words.length; i++) {
    if ((thread[thread.length - 1] + words[i]).length > 280) {
      thread.push(words[i]);
    } else {
      thread[thread.length - 1] += ' ' + words[i];
    }
  }
  if (!copyright){
    await v2Client.tweetThread([{ text: `"${title}"`, media: { media_ids: [mediaId] } },...thread,]);
    return;
  }
  const createdTweet = await v2Client.tweetThread([{ text: `"${title}" by ${copyright}`, media: { media_ids: [mediaId] } },...thread]);
};
postTweet();
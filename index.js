const rwClient = require("./twitterClient");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
let CronJob = require("cron").CronJob;

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const generateText = async () => {

  const prompt = "write a tweet for a drinking toast";

  try {
    const response = await openai.createCompletion({
      prompt,
      n: 1,
      model: "text-davinci-003",
      max_tokens: 2048,
      temperature: 1,
    });

    let result = response.data.choices[0].text;

    //Running task every 24 hours
    let job = new CronJob("0 0 * * *", () => {
      tweet(result);
    });

    job.start();

  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

generateText();

//Tweet
const tweet = async (text) => {
  try {
    await rwClient.v2.tweet({
      text: text,
    });
  } catch (error) {
    console.error(error);
  }
};

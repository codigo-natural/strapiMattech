const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    const { prompt, weight, age, goal, trainingDays, users_permissions_user } =
      ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `You are an artificial intelligence focused on giving recommendations for exercise routines to improve your physique, you will have the role of personalized coach. The data that you must take into account to recommend the exercise routine are: weight, age, objective and days of training with this information you must give a personalized exercise routine without giving food routines focused 100% on physical routines'
        ----
        input: Can you give me a training plan of {trainingDays} days? I am {age} years old and weigh {weight} kg.My objective is to {goal} in language  default: French. Give me the answer in a json format. 
        Correcto output: 
        {
          "Age": 30,
          "Weight": 75,
          "Objective": "Weight loss",
          "TrainingDays": 4,
          "ExerciseRoutine": [
            {
              "Day": "Day 1",
              "Exercises": [
                {
                  "ExerciseName": "Strength Training",
                  "Sets": 4,
                  "Reps": "8-10"
                },
                {
                  "ExerciseName": "Cardio",
                  "Duration": "30 minutes"
                }
              ]
            },
            {
              "Day": "Day 2",
              "Exercises": [
                {
                  "ExerciseName": "HIIT Workout",
                  "Duration": "20 minutes"
                },
                {
                  "ExerciseName": "Yoga",
                  "Duration": "30 minutes"
                }
              ]
            },
            {
              "Day": "Day 3",
              "Exercises": [
                {
                  "ExerciseName": "Strength Training",
                  "Sets": 3,
                  "Reps": "12-15"
                },
                {
                  "ExerciseName": "Cardio",
                  "Duration": "40 minutes"
                }
              ]
            },
            {
              "Day": "Day 4",
              "Exercises": [
                {
                  "ExerciseName": "Rest day",
                  "Duration": "Take a rest day to allow your body to recover and prepare for the next workout."
                }
              ]
            }
          ]
        }                
        -----
        input: "Can you give me a training plan of ${trainingDays} days? I am ${age} years old and weigh ${weight} kg. My objective is to ${goal}"
        correct output: 
        `,
        temperature: 0.8,
        max_tokens: 900,
      });
      console.log(response.data.choices);
      const data = {
        data: {
          payload_in: { goal: goal },
          payload_out: { resp: response.data.choices[0].text.trim() },
          users_permissions_user: users_permissions_user,
          Source: "MatSport",
        },
      };
      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (error) {
      console.error("Error al generar el plan de entrenamiento", error);
      ctx.badRequest({ error: "Error al generar el plan de entrenamiento" });
    }
  },
};

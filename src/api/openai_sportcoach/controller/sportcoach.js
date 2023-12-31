const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    const {
      weight,
      age,
      goal,
      trainingDays,
      language,
      users_permissions_user,
    } = ctx.request.body;

    // console.log("Estos son los datos: ", ctx.request.body);

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
        As a personalized fitness trainer, your role is to create customized exercise recommendations to improve individuals' physiques. You need to consider factors like weight, age, fitness objectives, 
        and training frequency. Your task involves developing detailed training plans tailored to each person's unique profile, and the output should be presented in a valid JSON format for easy integration into different systems. 
        Your expertise in personalized training strategies will be reflected in the well-structured exercise routine you craft, aligning with the user's specific fitness goals.
        ----
        input: "Generates a training plan of {2} days with the following data: i am {28} years old, my weigh is {52} kg.My objective is to {muscle building}. The respond language must be in {French}". 
        Correcto output: 
        {
          "resp": [
            {
              "day": "Jour 1. Entraînement de Force pour l'ensemble du Corps",
              "exercises": [
                {"name": "Deadlifts", "description": "4 séries de 8-10 répétitions"},
                {"name": "Pompes", "description": "3 séries de 15-20 répétitions"},
                {"name": "Tirage horizontal", "description": "3 séries de 10-12 répétitions"}
              ]
            },
            {
              "day": "Jour 2. Cardio et Abdos",
              "exercises": [
                {"name": "Activité cardio de votre choix : course à pied, vélo, natation", "description": "30 à 45 minutes à une intensité modérée"},
                {"name": "Crunch abdominaux", "description": "3 séries de 15 à 20 répétitions"},
                {"name": "Mountain climbers", "description": "3 séries de 12 à 15 répétitions"}
              ]
            }
          ]
        }                     
        -----
        input: "Generates a training plan of {3} days with the following data: i am {28} years old, my weigh is {52} kg.My objective is to {crossfit}. The respond language must be in {english}".
        correct output:
        {
          "resp": [
            {
              "day": "Day 1. CrossFit WOD (Workout of the Day)",
              "exercises": [
                {"name": "Warm-up", "description": "10 minutes of dynamic stretching and mobility exercises"},
                {"name": "Power Cleans", "description": "5 rounds of 8 reps, increasing weight each round"},
                {"name": "Box Jumps", "description": "4 sets of 10 jumps"},
                {"name": "Double-Unders", "description": "3 sets of 50 reps"}
              ]
            },
            {
              "day": "Day 2. CrossFit Metcon (Metabolic Conditioning)",
              "exercises": [
                {"name": "Rowing", "description": "5 rounds of 500 meters, rest 1 minute between rounds"},
                {"name": "Kettlebell Swings", "description": "4 sets of 15 reps"},
                {"name": "Burpees", "description": "3 sets of 20 reps"}
              ]
            },
            {
              "day": "Day 3. CrossFit Endurance",
              "exercises": [
                {"name": "Running", "description": "Interval training: 6x400 meters with 1-minute rest between intervals"},
                {"name": "Thrusters", "description": "5 sets of 12 reps"},
                {"name": "Toes-to-Bar", "description": "3 sets of 15 reps"}
              ]
            }
          ]
        }
        -----
        input: "Generates a training plan of ${trainingDays} days with the following data: i am ${age} years old, my weigh is ${weight} kg.My objective is to ${goal}. The respond language must be in ${language}".
        correct output: 
        `,
        temperature: 0.8,
        max_tokens: 1500,
      });

      // console.log("Esto devuelvo", response.data.choices[0].text.trim());

      const data = {
        data: {
          payload_in: { goal: goal },
          payload_out: {
            resp: response.data.choices[0].text.trim(),
          },
          users_permissions_user: users_permissions_user,
          Source: "MatSport",
        },
      };
      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: JSON.parse(response.data.choices[0].text.trim()) });
    } catch (error) {
      ctx.badRequest({ error: "Error generating training plan" });
    }
  },
};

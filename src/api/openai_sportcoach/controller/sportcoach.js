const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    const {
      prompt,
      weight,
      age,
      goal,
      trainingDays,
      language,
      users_permissions_user,
    } = ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You will have the role of personalized trainer focused on giving recommendations for exercise routines to improve your physique. The data that you must take into account to recommend the exercise routine are: weight, age, objective and training days based on this information you must give a training plan. the result must be in valid JSON format'
        ----
        input: Generates a training plan of {trainingDays} days with the following data: i am {age} years old and weigh {weight} kg.My objective is to {goal} in language for default {languge}. 
        Correcto output: 
        {
          "resp": [
            {
              "day": "Day 1. Upper Body Strength Training",
              "exercises": [
                {"name": "Warm up", "description": "5-10 minutes of light cardio: jogging in place, jumping jacks"},
                {"name": "Bench press", "description": "3 sets of 8-10 reps"},
                {"name": "Bicep curls", "description": "3 sets of 10-12 reps"}
              ]
            },
            {
              "day": "Day 2. Cardio and Abs",
              "exercises": [
                {"name": "Cardio activity of your choice: running, cycling, swimming", "description": "30-45 minutes at a moderate intensity"},
                {"name": "Abdominal crunches", "description": "3 sets of 15-20 reps"},
                {"name": "Mountain climbers", "description": "3 sets of 12-15 reps"}
              ]
            },
            {
              "day": "Day 3. Lower Body Strength Training",
              "exercises": [
                {"name": "Squats", "description": "3 sets of 8-10 reps"},
                {"name": "Lunges", "description": "3 sets of 8-10 reps (each leg)"},
                {"name": "Deadlifts", "description": "3 sets of 8-10 reps"}
              ]
            },
            {
              "day": "Day 4. Core and Calves",
              "exercises": [
                {"name": "Calf raises", "description": "3 sets of 12-15 reps"},
                {"name": "Glute bridges", "description": "3 sets of 10-12 reps"},
                {"name": "Core exercise of your choice: bicycle crunches, reverse crunches", "description": "3 sets of 15-20 reps"}
              ]
            },
            {
              "day": "Day 5. Full-Body Circuit Training",
              "exercises": [
                {"name": "Warm up", "description": "5-10 minutes of light cardio: jogging, jumping jacks"},
                {"name": "Circuit", "description": "Perform each exercise back-to-back with little to no rest. Repeat the circuit 3 times."},
                {"name": "Push-ups", "description": "10-12 reps"}
              ]
            },
            {
              "day": "Day 6. Lower Body and Core",
              "exercises": [
                {"name": "Bodyweight squats", "description": "12-15 reps"},
                {"name": "Plank", "description": "Hold for 30-60 seconds"},
                {"name": "Dumbbell shoulder press", "description": "10-12 reps"}
              ]
            },
            {
              "day": "Day 7. Upper Body and Core",
              "exercises": [
                {"name": "Dumbbell rows", "description": "10-12 reps (each arm)"},
                {"name": "Walking lunges", "description": "12-15 reps (each leg)"},
                {"name": "Bicycle crunches", "description": "15-20 reps"}
              ]
            }
          ]
        }                           
        -----
        input: "Can you give me a training plan of ${trainingDays} days? I am ${age} years old and weigh ${weight} kg. My objective is to ${goal} in language for default ${language}"
        correct output: 
        `,
        temperature: 0.8,
        max_tokens: 1500,
      });
      const data = {
        data: {
          payload_in: { goal: goal },
          payload_out: { 
            resp: response.data.choices[0].text.trim() 
          },
          users_permissions_user: users_permissions_user,
          Source: "MatSport",
        },
      };
      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (error) {
      ctx.badRequest({ error: "Error generating training plan" });
    }
  },
};

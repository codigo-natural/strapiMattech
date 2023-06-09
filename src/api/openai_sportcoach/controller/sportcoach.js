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
        prompt: `You are an artificial intelligence focused on giving recommendations for exercise routines to improve your physique, you will have the role of personalized coach. The data that you must take into account to recommend the exercise routine are: weight, age, objective and days of training based on this information you must give a training plan.'
        ----
        input: Can you give me a training plan of {trainingDays} days? I am {age} years old and weigh {weight} kg.My objective is to {goal} in language  default: French. 
        Correcto output: 
        Day 1: Upper Body Strength Training

        Warm up: 5-10 minutes of light cardio (e.g., jogging in place, jumping jacks)
        Bench press: 3 sets of 8-10 reps
        Shoulder press: 3 sets of 8-10 reps
        Bent-over rows: 3 sets of 8-10 reps
        Bicep curls: 3 sets of 10-12 reps
        Tricep dips: 3 sets of 10-12 reps
        Core exercise of your choice (e.g., planks, Russian twists): 3 sets of 30 seconds each
        Day 2: Cardio and Abs

        Warm up: 5-10 minutes of light cardio (e.g., jogging, cycling)
        Cardio activity of your choice (e.g., running, cycling, swimming): 30-45 minutes at a moderate intensity
        Abdominal crunches: 3 sets of 15-20 reps
        Russian twists: 3 sets of 15-20 reps
        Leg raises: 3 sets of 10-12 reps
        Mountain climbers: 3 sets of 12-15 reps
        Day 3: Lower Body Strength Training

        Warm up: 5-10 minutes of light cardio (e.g., jogging in place, jumping jacks)
        Squats: 3 sets of 8-10 reps
        Lunges: 3 sets of 8-10 reps (each leg)
        Deadlifts: 3 sets of 8-10 reps
        Calf raises: 3 sets of 12-15 reps
        Glute bridges: 3 sets of 10-12 reps
        Core exercise of your choice (e.g., bicycle crunches, reverse crunches): 3 sets of 15-20 reps
        Day 4: Rest and Recovery

        Take a day off from intense physical activity.
        Engage in light activities like walking or stretching to promote recovery.
        Day 5: Full-Body Circuit Training

        Warm up: 5-10 minutes of light cardio (e.g., jogging, jumping jacks)
        Circuit: Perform each exercise back-to-back with little to no rest. Repeat the circuit 3 times.
        Push-ups: 10-12 reps
        Bodyweight squats: 12-15 reps
        Plank: Hold for 30-60 seconds
        Dumbbell shoulder press: 10-12 reps
        Dumbbell rows: 10-12 reps (each arm)
        Walking lunges: 12-15 reps (each leg)
        Bicycle crunches: 15-20 reps             
        -----
        input: "Can you give me a training plan of ${trainingDays} days? I am ${age} years old and weigh ${weight} kg. My objective is to ${goal} in language  default: French"
        correct output: 
        `,
        temperature: 0.8,
        max_tokens: 800,
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

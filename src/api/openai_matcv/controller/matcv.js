const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

function parseData(rawData) {
  const lines = rawData.split("\n");
  const name = lines.shift().trim();
  const contactInfo = {};
  const professionalProfileIndex = lines.indexOf("Professional Profile");
  const professionalExperienceIndex = lines.indexOf("Professional Experience");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("Phone:")) {
      contactInfo.phone = line.replace("Phone:", "").trim();
    } else if (line.startsWith("Email:")) {
      contactInfo.email = line.replace("Email:", "").trim();
    }
  }

  const professionalProfile = lines
    .slice(professionalProfileIndex + 1, professionalExperienceIndex)
    .join("\n")
    .trim();

  const professionalExperience = lines
    .slice(professionalExperienceIndex + 1)
    .join("\n")
    .trim();

  return {
    name,
    contactInfo,
    professionalProfile,
    professionalExperience,
  };
}

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui");
    const {
      fullName,
      phoneNumber,
      email,
      nacionality,
      fieldOfStudy,
      occupation,
      activityArea,
      users_permissions_user,
    } = ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
       You are a Human Resources Manager, you are here to assist me in crafting an impressive Curriculum Vitae (CV) 
       and professional profile based on the following information, Don't add references information and the note:
       1. personal information: ${fullName}, ${phoneNumber}, ${email}, ${nacionality}
       2. professional information: ${fieldOfStudy}, ${occupation}
        3. professional experience: ${activityArea}, ${occupation}
        `,
        temperature: 1.0,
        max_tokens: 1000,
      });

      const treatedData = parseData(response.data.choices[0].text.trim());

      const data = {
        data: {
          payload_in: {
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            nacionality: nacionality,
            fieldOfStudy: fieldOfStudy,
            activityArea: activityArea,
            occupation: occupation,
          },
          payload_out: {
            resp: treatedData,
          },
          users_permissions_user: users_permissions_user,
          Source: "MatCV",
        },
      };

      const request = await strapi.db
        .query("api::request.request")
        .create(data);

      ctx.send({ data: treatedData });
    } catch (error) {
      console.error("Error try to generate the CV", error);
      ctx.badRequest({ error: "Error try to generate the CV" });
    }
  },
};

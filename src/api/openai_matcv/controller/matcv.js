const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui en matcv profile");
    const { role, market, keywords, language, users_permissions_user } =
      ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
       You are a Human Resources Manager, you are here to assist me in crafting an impressive Curriculum Vitae (CV), i will send you the {language} the output must be in that language,
        you will be helping me to create a profile description based on the following information, Don't add references information and the note:
     
       --
       input: role: {Web development}, market: {Tech}, keywords: {nextjs, react, taiwind, nodejs, express} in {english}
       Correct ouput:Experienced web developer specializing in the tech sector, proficient in Next.js, React, Tailwind, Node.js, and Express. 
       Skilled in creating dynamic and responsive websites, optimizing user experiences, and delivering high-quality solutions.
       --
       input: role: {lider de equipo}, market: {Mercadeo}, keywords: {seo, sem, redes sociales, negocios digitales, marcas} in {french}
        Correct ouput:Chef d'équipe avec une vaste expérience dans le secteur du marketing. Expert en SEO, SEM et réseaux sociaux, capable de stimuler les entreprises numériques et de renforcer les marques. Compétences exceptionnelles en gestion d'équipe et en mise en œuvre de stratégies de marketing en ligne.
       --
        input: role: ${role}, market: ${market}, keywords: ${keywords} in ${language}
        Correct ouput:`,
        temperature: 0.7,
        presence_penalty: 0.5,
        max_tokens: 1000,
      });

      const data = {
        data: {
          payload_in: {
            role: role,
            market: market,
            keywords: keywords,
          },
          payload_out: {
            resp: response.data.choices[0].text.trim(),
          },
          users_permissions_user: users_permissions_user,
          Source: "MatCV",
        },
      };

      await strapi.db.query("api::request.request").create(data);

      ctx.send({ data: response.data.choices[0].text.trim() });
    } catch (error) {
      console.error("Error try to generate the CV", error);
      ctx.badRequest({ error: "Error try to generate the CV" });
    }
  },
};

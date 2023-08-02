const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  async generateExperience(ctx) {
    console.log("entre aqui en experience");
    const {
      role,
      market,
      keywords,
      language = "auto",
      users_permissions_user,
    } = ctx.request.body;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
       You are a Human Resources Manager, you are here to assist me in crafting an impressive Curriculum Vitae (CV),you can also recive auto which means that you have to detect the language, in this case you
        will be helping me to create a Job experience description based on the following information, Don't add references information and the note:
     
       --
       input: role: {Team leader}, market: {digital marketing}, keywords: {leader, front end, backend - strapi} in {english}
       Correct ouput:I led the digital marketing team, supervising and coordinating the marketing strategies to drive the growth of the company.
       Developed and designed the user interface (front-end) of the company's website, using technologies such as HTML, CSS and JavaScript.
       I implemented the backend functionality of the website using Strapi, an open source CMS.
       Directed digital marketing campaigns to increase brand visibility and generate qualified leads.
       Analyzed and optimized the performance of digital marketing campaigns by tracking metrics and analyzing data.
       --
       input: role: {Psicólogo Organizacional}, market: {laboral}, keywords: {Recursos Humanos,Consultoría,Desarrollo Organizacional,Coaching Ejecutivo} in {auto}
       correct ouput:Elaboración y ejecución de programas de desarrollo organizacional para mejorar la eficiencia y productividad de la empresa.
       Asesoramiento en la gestión de recursos humanos para optimizar la selección, retención y desarrollo del talento.
       Realización de evaluaciones psicológicas y análisis de competencias para identificar áreas de mejora y potenciar el rendimiento del personal.
       Implementación de programas de coaching ejecutivo para fortalecer habilidades de liderazgo y mejorar el desempeño de los directivos.
       Brindar consultoría en temas de clima laboral, comunicación organizacional y resolución de conflictos para fomentar un ambiente de trabajo saludable y productivo.
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

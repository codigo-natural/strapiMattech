const { Configuration, OpenAIApi } = require("openai");
// const crypto = require("crypto");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

const socialMediaKeywords = {
  facebook: ["facebook", "fb"],
  twitter: ["twitter", "tw"],
  instagram: ["instagram", "ig", "insta"],
  telegram: ["telegram", "tg"],
  whatsapp: ["whatsapp", "wa"],
};

module.exports = {
  async generateResponse(ctx) {
    console.log("entre aqui");
    const {
      productDescription,
      company,
      field,
      socialMedia,
      language,
      users_permissions_user,
    } = ctx.request.body;
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You are an AI copywriter tasked with generating engaging copy for various social media platforms. Your goal is to create compelling content that resonates with the audience while maintaining consistency in tone and style across platforms. Remember that you can receive the parameter {auto} to automatically detect the language of the provided text. Include at least 3 emojis in each social media post to add flair to your copy.
        Keep in mind:
        - For each social media platform, generate different copy, tailored to its unique audience.
        - When the language parameter is {auto}, detect the language of the product description and generate all copies in that language.
        Training examples:
        --
        Training input: "Give me a copywriting idea for ["facebook"] advertising in {english}. {XfarmV} is a {retail} company that sells {precision agriculture technologies}".
        Correct output: "FB:Elevate your farming journey with XfarmV's AgroAdvance. 🚀Experience cutting-edge solutions tailored for the modern farmer🚜, delivering exceptional results and driving agricultural success🌱. #AgroAdvance #FarmingInnovation".
        --
        Training input: "Give me a copywriting idea for ["twitter"] advertising in {auto}. {TechCo} is a {technology-focused} company that sells {Software and Applications}".
        Correct output: "TW:Experience the Future of Technology with {TechCo}'s Advanced Software Solutions💻. Discover a world of possibilities with our diverse range of software applications tailored to meet your needs. 🔒From secure solutions to intuitive interfaces, {TechCo} empowers you to transform the way you work and play. 🔥#TechCo #AdvancedSolutions #Innovation".
        --
        Training input: "Give me a copywriting idea for ["instagram", "twitter"] advertising in {english}. {ColSanitas} is a {healthcare-focused} company that take care of {health}".
        Correct output: "IG:💪Embrace a healthier you with ColSanitas' HealthPlus. From preventive care to specialized treatments, our comprehensive healthcare solutions cater to individuals of all ages. Join our thriving community and prioritize your well-being like never before.",
        "TW: Your health matters❤️‍🩹, and at ColSanitas, we make it our mission to provide exceptional care💊. Trust our healthcare-focused company to prioritize your well-being and support you every step of the way. 🌈 #ColSanitas #Healthcare"
        --
        Training input: "Give me a copywriting idea for ["telegram"] advertising in {spanish}. {Walmart} is a {retail-focused} company that sells {everything}".
        Correct output: "TG:¡📢Descubre en Walmart! Únete a nuestro canal de Telegram para las mejores ofertas, promociones y novedades. 🎉 Compra desde casa y encuentra todo lo que necesitas en un solo lugar. ¡No te pierdas nuestras exclusivas ofertas en productos de calidad a precios increíbles! Únete hoy y disfruta de una experiencia única con Walmart. ¡Te esperamos!😉".
        --
        Training input: "Give me a copywriting idea for ["whatsApp"] advertising in {english}. {Walmart} is a {retail-focused} company that sells {everything}".
        Correct output: "WA:🛒✨Upgrade your shopping experience with Walmart's QuickMart. Say goodbye to long queues and endless browsing. With QuickMart, shopping is just a message away.📲 Get personalized recommendations, exclusive deals, and fast deliveries. Join our community of savvy shoppers and enjoy hassle-free convenience".
        --
        Training input: "Give me a copywriting idea for ${socialMedia} advertising in ${language}. ${company} is a ${field} company that sells ${productDescription}".
        correct output:
        `,
        temperature: 0.6,
        max_tokens: 1000,
      });

      let detectedSocialMedia = null;
      for (const socialMedia in socialMediaKeywords) {
        const keywords = socialMediaKeywords[socialMedia];
        if (
          keywords.some((keyword) =>
            socialMedia.toLowerCase().includes(keyword)
          )
        ) {
          detectedSocialMedia = socialMedia;
          break;
        }
      }

      const data = {
        data: {
          payload_in: {
            socialMedia: socialMedia,
            language: language,
            company: company,
            field: field,
            productDescription: productDescription,
          },
          payload_out: {
            copywriting: response.data.choices[0].text.trim(),
            // id: crypto.randomUUID(),
            // socialMedia: socialMedia,
          },
          users_permissions_user: users_permissions_user,
          Source: "MatDescription",
        },
      };
      await strapi.db.query("api::request.request").create(data);

      ctx.send(data.data.payload_out);
    } catch (error) {
      console.error("Error generating the copy ", error);
      ctx.badRequest({ error: "Error generating the copy " });
    }
  },
};

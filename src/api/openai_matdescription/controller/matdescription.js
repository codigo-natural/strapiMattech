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
        prompt: `Instruction: Generate creative ad copy without additional spaces at the beginning for different social media platforms and languages.

        Context: Optimized text is required for each social network without extra spaces at the beginning, regardless of language.
        
        examples:
        
        input: "Give me a copywriting idea for ["instagram", "twitter"] advertising in ${language}. {ColSanitas} is a {healthcare-focused} company that take care of {health}"
        output: "IG:💪Embrace a healthier you with ColSanitas' HealthPlus. From preventive care to specialized treatments, our comprehensive healthcare solutions cater to individuals of all ages. Join our thriving community and prioritize your well-being like never before."
        
        input: "Give me a copywriting idea for ["facebook"] advertising in ${language}. {XfarmV} is a {retail} company that sells {precision agriculture technologies}"
        output: "FB:Elevate your farming journey with XfarmV's AgroAdvance. 🚀Experience cutting-edge solutions tailored for the modern farmer🚜, delivering exceptional results and driving agricultural success🌱. #AgroAdvance #FarmingInnovation"
        
        input: "Give me a copywriting idea for ["twitter"] advertising in ${language}. {TechCo} is a {technology-focused} company that sells {Software and Applications}"
        output: "TW:Experience the Future of Technology with {TechCo}'s Advanced Software Solutions💻. Discover a world of possibilities with our diverse range of software applications tailored to meet your needs. 🔒From secure solutions to intuitive interfaces, {TechCo} empowers you to transform the way you work and play. 🔥#TechCo #AdvancedSolutions #Innovation"
        
        input: "Give me a copywriting idea for ["telegram"] advertising in ${language}. {Walmart} is a {retail-focused} company that sells {everything}"
        incorrect output: " TG: Scopri un mondo di possibilità con le nostre soluzioni software avanzate! "
        correct output: "TG:¡📢Discover at Walmart! Join our Telegram channel for the best offers, promotions and news. 🎉 Shop from home and find everything you need in one place. Don't miss our exclusive offers on quality products at incredible prices! Join today and enjoy a unique experience with Walmart. We are waiting for you!😉"
        
        Remember, do not include extra spaces at the beginning in any language.
        --
        input: "Give me a copywriting idea for ${socialMedia} advertising in ${language}. ${company} is a ${field} company that sells ${productDescription}".
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
      console.log(data.data.payload_out)
      await strapi.db.query("api::request.request").create(data);

      ctx.send(data.data.payload_out);
    } catch (error) {
      console.error("Error generating the copy ", error);
      ctx.badRequest({ error: "Error generating the copy " });
    }
  },
};

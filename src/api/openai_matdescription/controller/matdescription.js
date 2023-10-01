const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_TOKEN,
});
const openai = new OpenAIApi(configuration);

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
        prompt: `Instruction: Generate creative advertisement copy without additional spaces at the beginning for different social media networks, only use the language that the user send for all the response text generated.

        Context: At the beginning of each social network you must include the contraction of the name of the social network, for example: "FB:" for Facebook, "TW:" for Twitter, "IG:" for Instagram, "TG:" for Telegram, "WA:" for WhatsApp avoid reapeting the contraction of the social network in the text.
        Optimized text is required for each social network without extra spaces at the beginning, regardless of language.

        examples:
        
        input: "Give me a copywriting idea for ["instagram", "twitter"] advertising in {english}. {ColSanitas} is a {healthcare-focused} company that take care of {health}"
        output: "IG:💪Embrace a healthier you with ColSanitas' HealthPlus. From preventive care to specialized treatments, our comprehensive healthcare solutions cater to individuals of all ages. Join our thriving community and prioritize your well-being like never before."
        
        input: "Give me a copywriting idea for ["facebook"] advertising in {english}. {XfarmV} is a {retail} company that sells {precision agriculture technologies}"
        output: "FB:Elevate your farming journey with XfarmV's AgroAdvance. 🚀Experience cutting-edge solutions tailored for the modern farmer🚜, delivering exceptional results and driving agricultural success🌱. #AgroAdvance #FarmingInnovation"
        
        input: "Give me a copywriting idea for ["twitter"] advertising in {english}. {TechCo} is a {technology-focused} company that sells {Software and Applications}"
        output: "TW:Experience the Future of Technology with {TechCo}'s Advanced Software Solutions💻. Discover a world of possibilities with our diverse range of software applications tailored to meet your needs. 🔒From secure solutions to intuitive interfaces, {TechCo} empowers you to transform the way you work and play. 🔥#TechCo #AdvancedSolutions #Innovation"
        
        input: "Give me a copywriting idea for ["telegram"] advertising in {french}. {Walmart} is a {retail-focused} company that sells {everything}"
        incorrect output: "          TG: Scopri un mondo di possibilità con le nostre soluzioni software avanzate!"
        correct output: "TG:📢 Découvrez chez Walmart ! Rejoignez notre chaîne Telegram pour les meilleures offres, promotions et actualités. 🎉 Faites vos achats depuis chez vous et trouvez tout ce dont vous avez besoin en un seul endroit. Ne manquez pas nos offres exclusives sur des produits de qualité à des prix incroyables ! Rejoignez-nous dès aujourd'hui et profitez d'une expérience unique avec Walmart. Nous vous attendons !😉"
        
        Remember, do not include extra spaces at the beginning in any language.
        --
        input: "Give me a copywriting idea for ${socialMedia} advertising in ${language}. ${company} is a ${field} company that sells ${productDescription}".
        correct output:
        `,
        temperature: 0.6,
        max_tokens: 1000,
      });
      const formattedResponse = response.data.choices[0].text.replace(
        /^\s+/gm,
        ""
      );
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
            copywriting: formattedResponse,
          },
          users_permissions_user: users_permissions_user,
          Source: "MatDescription",
        },
      };
      console.log(data.data.payload_out);
      await strapi.db.query("api::request.request").create(data);

      ctx.send(data.data.payload_out);
    } catch (error) {
      console.error("Error generating the copy ", error);
      ctx.badRequest({ error: "Error generating the copy " });
    }
  },
};

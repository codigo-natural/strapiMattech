module.exports = {
  async generateDescription(ctx) {
    // Extract the `messages` from the body of the request
    const { prompt, aiResponse } = await ctx.request.body;
    console.log("backend messages here", aiResponse);

    try {
      const data = {
        data: {
          payload_in: {
            prompt: prompt,
          },
          payload_out: {
            aiResponse: aiResponse,
          },
          users_permissions_user: 2,
          Source: "MatDescription",
        },
      };
      await strapi.db.query("api::request.request").create(data);

      ctx.send("ok saved");

      // ctx.send(payload);

      // return new StreamingTextResponse(stream);
    } catch (error) {
      ctx.badRequest("Could not generate response :" + error);
    }
  },
};

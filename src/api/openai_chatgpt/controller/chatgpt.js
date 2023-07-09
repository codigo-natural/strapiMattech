module.exports = {
  async generateResponse(ctx) {
    // Extract the `messages` from the body of the request
    const { prompt, aiResponse, users_permissions_user } = await ctx.request
      .body;
    console.log("backend messages here", aiResponse);

    try {
      const data = {
        data: {
          payload_in: { prompt: prompt },
          payload_out: { resp: aiResponse },
          users_permissions_user: users_permissions_user,
          Source: "MatChat",
        },
      };
      const resquest = await strapi.db
        .query("api::request.request")
        .create(data);
      console.log("resquest", resquest.id);
      ctx.send({ reqId: resquest.id });

      // ctx.send(payload);

      // return new StreamingTextResponse(stream);
    } catch (error) {
      ctx.badRequest("Could not generate response :" + error);
    }
  },
};

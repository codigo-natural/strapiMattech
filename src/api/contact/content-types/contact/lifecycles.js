module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      await strapi.plugins["email"].services.email.send({
        to: "",
        from: "",
        subject: "New Contact Form Submission",
        text: `Name: ${result.name}\nEmail: ${result.email}\nMessage: ${result.message}`,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

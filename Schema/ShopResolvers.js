const shop = require("../Routes/salons");
const { ForbiddenError } = require("apollo-server-express");
const shopResolvers = {
  Query: {
    async shops() {
      try {
        return await shop.getAllShops();
      } catch (e) {
        return e;
      }
    },
    //Need to be worked on
    async myShops(_, args, context) {},
    //Need to be worked on
    async shop(_, args) {
      try {
        return await shop.getShop(args.id);
      } catch (e) {
        console.log(e);
      }
    },
  },
  Mutation: {
    async createShop(_, args, context) {
      if (!context.user) {
        throw new ForbiddenError("Unauthorized");
      }
      try {
        await shop.createNewShop(context.user.id, args.shop);
        return args.shop;
      } catch (e) {
        return e;
      }
    },
    //Need to be worked on
    addService(_, args, context) {
      if (!context.user) {
        throw new ForbiddenError("Unauthorized");
      }
    },
    //Need to be worked on
    addTechnician(_, args, context) {
      if (!context.user) {
        throw new ForbiddenError("Unauthorized");
      }
    },
  },
};

module.exports = { shopResolvers };

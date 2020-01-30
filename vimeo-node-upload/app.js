const { ApolloServer } = require("apollo-server");
const port = process.env.PORT || 3000;
const typeDefs = require("./schema/schema");
const resolvers = require("./resolver/resolver");
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
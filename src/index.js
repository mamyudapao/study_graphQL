const { ApolloServer } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const { link } = require('fs/promises')
const path = require('path')

// 2 どう返すか
const resolvers = {
  Query: {
    info: () => `This is GraphQL`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },
  },
}

const prisma = new PrismaClient()

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))

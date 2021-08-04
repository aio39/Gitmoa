module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: 'gitmoa',
      url: 'http://localhost:4000/graphql',
    },
  },
}

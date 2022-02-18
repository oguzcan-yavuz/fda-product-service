module.exports = {
  postgres: {
    image: 'postgres',
    tag: '14.2-alpine',
    ports: [5432],
    env: {
      POSTGRES_USER: 'test-user',
      POSTGRES_PASSWORD: 'test-pass',
      POSTGRES_DB: 'test',
    },
    wait: {
      type: 'text',
      text: 'server started',
    },
  },
};

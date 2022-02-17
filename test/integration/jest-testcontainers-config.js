module.exports = {
  postgres: {
    image: 'postgres',
    tag: '14.2-alpine',
    ports: [5432],
    env: {
      POSTGRES_USER: 'integration-test-user',
      POSTGRES_PASSWORD: 'integration-test-pass',
      POSTGRES_DB: 'test',
    },
    wait: {
      type: 'text',
      text: 'server started',
    },
  },
};

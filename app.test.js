const request = require('supertest');
const app = require('./app');

describe('Test root route', function() {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  it('Should respond to the GET method with a 200', async function() {
    const response = await request(app)
                            .get('/')
                            .expect(200);
  });
});

describe('Test /user route', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('Should respond with user details', async () => {
    const response = await request(app)
                            .get('/user')

    expect(response.statusCode).toBe(302);
  });
});
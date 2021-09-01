const request = require('supertest');
const { validate } = require('uuid');

const { app } = require('../');


describe('Users', () => {
    it('Users should be able to create a new user', async() => {
        const userCreated = await request(app)
        .post('/users')
        .send({
          name: 'John Doe10',
          username: 'user10' 
        });
    
        expect(validate(userCreated.body.id)).toBe(true);
        expect(userCreated.body).toMatchObject(
          {
            name: userCreated.body.name,
            username: userCreated.body.username,
            id: userCreated.body.id,
            todos: []
          });
    
          expect(userCreated.status).toBe(201);
      });
    
      it('Users should be able to create a new user', async() => {
        const userRepeated = await request(app)
        .post('/users')
        .send({
          name: 'John Doe10',
          username: 'user10' 
        })
        .expect(400);
    
        expect(userRepeated.body.error).toBeTruthy();
      });
    })
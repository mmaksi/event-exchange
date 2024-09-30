const request = require('supertest');
const { app } = require('../../app');
const { Ticket } = require('../../models/tickets/tickets.mongo');
const { default: mongoose } = require('mongoose');

const createTicket = (cookie) => {
  const title = 'New York Event';
  const price = 10;
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie || global.signin())
    .send({ title, price });
};

describe('Tickets service', () => {
  describe('GET /api/tickets', () => {
    it('Finds all tickets', async () => {
      await createTicket();
      await createTicket();
      await createTicket();

      const response = await request(app).get('/api/tickets').send().expect(200);
      expect(response.body.length).toEqual(3);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('Returns 404 if ticket is not found', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      await request(app).get(`/api/tickets/${id}`).send().expect(404);
    });

    it('Returns the ticket if ticket is found', async () => {
      const title = 'New York Event';
      const price = 10;

      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title, price });

      const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

      expect(ticketResponse.body.title).toEqual(title);
      expect(ticketResponse.body.price).toEqual(price);
    });
  });

  describe('POST /api/tickets', () => {
    it('Has a route handler listening to /api/tickets for post requests', async () => {
      const response = await request(app).post('/api/tickets').send({});
      expect(response.status).not.toEqual(404);
    });

    it('Can only be accessed if the user is logged in', async () => {
      const response = await request(app).post('/api/tickets').send({
        title: 'New York Event',
        price: 10,
      });
      expect(response.status).toEqual(401);
    });

    it('Return an error if an invalid title is provided', async () => {
      const cookie = global.signin();
      await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
          title: '',
          price: 10,
        })
        .expect(400);

      await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
          price: 10,
        })
        .expect(400);
    });

    it('Return an error if an invalid price is provided', async () => {
      const cookie = global.signin();
      await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
          title: 'New York Event',
          price: -10,
        })
        .expect(400);

      await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
          title: 'New York Event',
        })
        .expect(400);
    });

    it('Creates a ticket with valid inputs', async () => {
      const title = 'New York Event';
      let tickets = await Ticket.find({});
      expect(tickets.length).toEqual(0);

      const cookie = global.signin();
      const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
          title,
          price: 10,
        });

      tickets = await Ticket.find({});
      expect(tickets.length).toEqual(1);
      expect(response.status).toEqual(201);
      expect(tickets[0].price).toEqual(10);
      expect(tickets[0].title).toEqual(title);
    });
  });

  describe('PUT /api/tickets', () => {
    it('Returns 404 if the ticket is not found', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({ title: 'New York Event', price: 10 })
        .expect(404);
    });

    it('Returns 401 if the user is not authenticated', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      await request(app)
        .put(`/api/tickets/${id}`)
        .send({ title: 'New York Event', price: 10 })
        .expect(401);
    });

    it('Return 401 if the user does not own the ticket', async () => {
      const response = await createTicket();
      await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
          title: 'London Event',
          price: 10,
        })
        .expect(401);
    });

    it('Returns 400 if an invalid input is provided', async () => {
      const cookie = global.signin();
      const response = await createTicket(cookie);
      await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: '',
          price: 25,
        })
        .expect(400);

      await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: 'London Event',
          price: -25,
        })
        .expect(400);
    });

    it('Updates the ticket with valid inputs', async () => {
      const cookie = global.signin();
      const response = await createTicket(cookie);

      await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
          title: 'London Event',
          price: 25,
        })
        .expect(200);

      const ticketesponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

      expect(ticketesponse.body.title).toEqual('London Event');
      expect(ticketesponse.body.price).toEqual(25);
    });
  });
});

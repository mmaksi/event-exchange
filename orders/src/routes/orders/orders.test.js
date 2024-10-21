const request = require('supertest');
const { app } = require('../../app');
const { Order } = require('../../models/orders/orders.mongo');
const { Ticket } = require('../../models/orders/ticket.mongo');
const mongoose = require('mongoose');
const { natsWrapper } = require('../../services/nats-wrapper');
const { OrderStatus } = require('@eventexchange/common');

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

describe('Orders service', () => {
  describe('GET /api/orders', () => {
    it('Gets items for a specific user', async () => {
      const ticketOne = await buildTicket();
      const ticketTwo = await buildTicket();
      const ticketThree = await buildTicket();

      const userOne = global.signin();
      const userTwo = global.signin();

      await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id, currentUserId: userOne.id })
        .expect(201);

      await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id, currentUserId: userTwo.id })
        .expect(201);
      await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id, currentUserId: userTwo.id })
        .expect(201);

      const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userOne)
        .expect(200);

      expect(response.body.length).toEqual(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('Gets items for a specific user', async () => {
      const ticketOne = await buildTicket();
      const ticketTwo = await buildTicket();
      const ticketThree = await buildTicket();

      const userOne = global.signin();
      const userTwo = global.signin();

      await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id, currentUserId: userOne.id })
        .expect(201);

      await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id, currentUserId: userTwo.id })
        .expect(201);
      await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id, currentUserId: userTwo.id })
        .expect(201);

      const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userOne)
        .expect(200);

      expect(response.body.length).toEqual(1);
    });

    it('Gets the order associated with the signed-in user', async () => {
      // Create a ticket
      const ticket = await buildTicket();
      const user = global.signin();
      // Make a request to create an order with this ticket
      const { body: createdOrder } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

      // Make request to fetch the order
      const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${createdOrder.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

      expect(fetchedOrder.id).toEqual(createdOrder.id);
    });
  });

  describe('POST /api/orders', () => {
    it('Returns an error if the item does not exist', async () => {
      const ticketId = new mongoose.Types.ObjectId();
      await request(app)
        .post('/api/orders')
        .send({ ticketId })
        .set('Cookie', global.signin())
        .expect(404);
    });

    it('Returns an error if the item is already reserved', async () => {
      const ticket = await buildTicket();

      const order = Order.build({
        ticket,
        userId: '12345',
        status: OrderStatus.Created,
        expiresAt: new Date(),
      });
      await order.save();

      const response = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
    });

    it.todo('Emits an order created event');
  });

  describe('DELETE /api/orders/:id', () => {
    it('Marks an order as cancelled', async () => {
      // Create a ticket
      const ticket = await buildTicket();
      const user = global.signin();
      // Create an order
      const { body: createdOrder } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

      // Cancel the order
      const { body: fetchedOrder } = await request(app)
        .delete(`/api/orders/${createdOrder.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

      const updatedOrder = await Order.findById(createdOrder.id);
      expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
    });

    it.todo('Emits an order cancelled event');
  });
});

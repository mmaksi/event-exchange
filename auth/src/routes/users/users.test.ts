import request from 'supertest';
import { app } from '../../app';

declare global {
  var signin: () => Promise<string[]>;
}

describe('User Sign-up', () => {
  it('Returns 201 on successful signup', async () => {
    const response = await request(app).post('/api/users/signup').send({
      email: 'mmaksi.dev@gmail.com',
      password: 'long_password',
      confirmPassword: 'long_password',
    });

    expect(response.status).toEqual(201);
  });

  it('Returns 400 with an invalid email', async () => {
    const response = await request(app).post('/api/users/signup').send({
      email: 'invalidEmail', // invalid email
      password: 'password',
      confirmPassword: 'password',
    });
    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toBe('Invalid e-mail');
    expect(response.body.errors[0].field).toBe('email');
  });

  it('Returns 400 with an invalid password', async () => {
    const response = await request(app).post('/api/users/signup').send({
      email: 'test@test.com',
      password: 'asd',
      confirmPassword: 'password',
    });
    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toBe(
      'Password must be between 4 and 20 characters'
    );
  });

  it('Returns 400 with unmatched passwords', async () => {
    const response = await request(app).post('/api/users/signup').send({
      email: '5h6oQ@example.com',
      password: '123456789',
      confirmPassword: 'password',
    });
    expect(response.status).toEqual(400);
    expect(response.body.errors[0].message).toBe("Passwords don't match");
  });

  it('Returns 400 with missing required fields', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com ' })
      .expect(400);
    await request(app)
      .post('/api/users/signup')
      .send({ password: 'long_password' })
      .expect(400);
  });

  it('Disallows duplicate e-mails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'long_password' })
      .expect(400);
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'long_password' })
      .expect(400);
  });

  it('Sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: '5h6oQ@example.com',
        password: 'long_password',
        confirmPassword: 'long_password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('User Sign-in', () => {
  it('Fails when sign-in with an email that doesn\t exist', async () => {
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: '5h6oQ@example.com',
        password: 'long_password',
      })
      .expect(401);

    expect(response.get('Set-Cookie')).toBeUndefined();
  });

  it('Fails when sign-in with an incorrect email/password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: '5h6oQ@example.com',
        password: 'long_password',
        confirmPassword: 'long_password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: '5h6oQ@example.com',
        password: 'short_password',
      })
      .expect(401);

    expect(response.get('Set-Cookie')).toBeUndefined();
  });

  it('Sets a cookie after successful sign-in', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: '5h6oQ@example.com',
        password: 'long_password',
        confirmPassword: 'long_password',
      })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: '5h6oQ@example.com',
        password: 'long_password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('User Sign-out', () => {
  it('Clears the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'long_password',
        confirmPassword: 'long_password',
      })
      .expect(201);

    await request(app).post('/api/users/signout').send({}).expect(200);

    const response = await request(app)
      .post('/api/users/signout')
      .send({
        email: 'test@test.com',
        password: 'long_password',
        confirmPassword: 'long_password',
      })
      .expect(200);

    const cookie = response.get('Set-Cookie');
    if (!cookie) {
      throw new Error('Expected cookie but got undefined.');
    }
    expect(cookie[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});

describe('Current User', () => {
  it('Responds with current details of the current user', async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get('/api/users/current-user')
      .send({})
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.currentUser.id).toBeDefined();
  });

  it('Responds with null if the user is not authentiacted', async () => {
    const response = await request(app)
      .get('/api/users/current-user')
      .send({})
      .expect(401);

    expect(response.body.currentUser).toBeUndefined();
  });
});

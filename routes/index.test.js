var app = require("../app")
var request = require("supertest")


test("Sign Up", async () => {
    await request(app).post("/signup")
      .send({ token: 12, pseudo: 'clara', email: 'clara@gmail.com', password: '1234' })
      .expect(200)
      .expect({ result: true })
})

test("Sign In", async () => {
    await request(app).post("/signin")
      .send({ email: 'clara@gmail.com', password: '1234' })
      .expect(200)
      .expect({ result: true,  user: [{
      pseudo: 'clara',
      token: 12
    }] })
})

test("User", async () => {
    await request(app).get("/users")
      .query({ id: 12 })
      .expect(200)
      .expect({ result: true, user: [{
        pseudo: 'loulou',
        description: 'coucou !'
      }] })
})
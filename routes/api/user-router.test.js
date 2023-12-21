import mongoose from "mongoose";
import app from "../../app.js";
import User from "../../models/User.js";
import request from "supertest";
import jwt from "jsonwebtoken";

const {DB_HOST_TEST, PORT=3000, JWT_SECRET} = process.env;

describe("test /api/users/register route", ()=>{
   let server = null;
   beforeAll(async ()=>{
      await mongoose.connect(DB_HOST_TEST);
      server = app.listen(PORT);
   })

   afterAll(async ()=>{
      await mongoose.connection.close();
      server.close();
   })

   beforeEach(()=>{})

   afterEach(async ()=>{
      await User.deleteMany();
   })

   test("test /api/users/register with corectData", async ()=>{
      const signupData = {
         username: "Testuser",
         email: "testuser@mail.ua",
         password: "1234567"
      }
      const {body, statusCode} = await request(app).post("/api/users/register").send(signupData);
      expect(statusCode).toBe(201);
      expect(body.username).toBe(signupData.username);
      expect(body.email).toBe(signupData.email);

      const user = await User.findOne({email: signupData.email});
      expect(user.username).toBe(signupData.username);
   })

   test("test /api/users/register without email", async ()=>{
      const signupData = {
         username: "Testuser",
         password: "1234567"
      }
      const {body, statusCode} = await request(app).post("/api/users/register").send(signupData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("missing required field 'email'");
   })
   
   test("test /api/users/register with invalid email", async ()=>{
      const signupData = {
         username: "Testuser",
         email: "Testuser",
         password: "1234567"
      }
      const {body, statusCode} = await request(app).post("/api/users/register").send(signupData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("'email' must be valid e-mail");
   })
})



describe("test /api/users/login route", ()=>{
   let server = null;
   beforeAll(async ()=>{
      const signupData = {
         username: "Testuser",
         email: "testuser@mail.ua",
         password: "1234567"
      }
      await mongoose.connect(DB_HOST_TEST);
      server = app.listen(PORT);
      const {body, statusCode} = await request(app).post("/api/users/register").send(signupData);
   }, 10000)

   afterAll(async ()=>{
      await User.deleteMany();
      await mongoose.connection.close();
      server.close();
   })

   beforeEach(()=>{})

   afterEach(async ()=>{})

   test("test /api/users/login with corectData", async ()=>{
      const signinData = {
         email: "testuser@mail.ua",
         password: "1234567"
      }
      const {body, statusCode} = await request(app).post("/api/users/login").send(signinData);
      const {token} = body;
      const {id}=jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);
      expect(statusCode).toBe(200);
      expect(body.user.email).toBe(signinData.email);
      expect(body.user.subscription).toBe("starter");
      expect(body.user.email).toBe(user.email);

   })

   test("test /api/users/login without email", async ()=>{
      const signinData = {
         username: "Testuser",
         password: "1234567"
      }
      const {body, statusCode} = await request(app).post("/api/users/login").send(signinData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("missing required field 'email'");
   })
   
   test("test /api/users/login with invalid email", async ()=>{
      const signinData = {
         email: "Testuser",
         password: "1234567"
      }
      const {body, statusCode} = await request(app).post("/api/users/login").send(signinData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("'email' must be valid e-mail");
   })
})
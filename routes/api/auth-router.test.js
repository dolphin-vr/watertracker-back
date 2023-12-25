import mongoose from "mongoose";
import app from "../../app.js";
import User from "../../models/User.js";
import request from "supertest";
import jwt from "jsonwebtoken";

const {DB_HOST_TEST, PORT=3000, JWT_SECRET} = process.env;

describe("test /api/auth/signup route", ()=>{
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

   test("test /api/auth/signup with corectData", async ()=>{
      const signupData = {
         email: "testuser@mail.ua",
         password: "12345678"
      }
      const {body, statusCode} = await request(app).post("/api/auth/signup").send(signupData);
      expect(statusCode).toBe(201);
      expect(body.email).toBe(signupData.email);

      const user = await User.findOne({email: signupData.email});
      expect(user.username).toBe(signupData.username);
   })

   test("test /api/auth/signup without email", async ()=>{
      const signupData = {
         password: "12345678"
      }
      const {body, statusCode} = await request(app).post("/api/auth/signup").send(signupData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("missing required field 'email'");
   })
   
   test("test /api/users/signup with invalid email", async ()=>{
      const signupData = {
         email: "Testuser",
         password: "12345678"
      }
      const {body, statusCode} = await request(app).post("/api/auth/signup").send(signupData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("'email' must be valid e-mail");
   })
})



describe("test /api/auth/signin route", ()=>{
   let server = null;
   beforeAll(async ()=>{
      const signupData = {
         email: "testuser@mail.ua",
         password: "12345678"
      }
      await mongoose.connect(DB_HOST_TEST);
      server = app.listen(PORT);
      const {body, statusCode} = await request(app).post("/api/auth/signup").send(signupData);
   }, 10000)

   afterAll(async ()=>{
      await User.deleteMany();
      await mongoose.connection.close();
      server.close();
   })

   beforeEach(()=>{})

   afterEach(async ()=>{})

   test("test /api/auth/signin with corectData", async ()=>{
      const signinData = {
         email: "testuser@mail.ua",
         password: "12345678"
      }
      const {body, statusCode} = await request(app).post("/api/auth/signin").send(signinData);
      const {token} = body;
      const {id}=jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);
      expect(statusCode).toBe(200);
      expect(body.user.email).toBe(signinData.email);
      expect(body.user.waterNorma).toBe(0);
      expect(body.user.email).toBe(user.email);

   })

   test("test /api/auth/signin without email", async ()=>{
      const signinData = {
         password: "12345678"
      }
      const {body, statusCode} = await request(app).post("/api/auth/signin").send(signinData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("missing required field 'email'");
   })
   
   test("test /api/auth/signin with invalid email", async ()=>{
      const signinData = {
         email: "Testuser",
         password: "12345678"
      }
      const {body, statusCode} = await request(app).post("/api/auth/signin").send(signinData);
         expect(statusCode).toBe(400);
         expect(body.message).toBe("'email' must be valid e-mail");
   })
})
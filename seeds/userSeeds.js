import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.DB_STRING)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB error:", err));

async function generateFakeUser() {
  const hashedPassword = await bcrypt.hash("Hello-1234", 12);

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    isEmailVerified: true,
    password: hashedPassword,
    role: "user",
    dateOfBirth: faker.date.birthdate({ min: 18, max: 50, mode: "age" }),
    phoneNumber: "1111111111",
    gender: faker.person.sexType(),
    address: {
      line: faker.location.streetAddress(),
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: 382418,
      country: faker.location.country(),
    },
  };
}

async function seedUsers() {
  try {
    const fakeUsers = await Promise.all(
      Array.from({ length: 20 }, () => generateFakeUser())
    );

    await User.insertMany(fakeUsers);
    console.log("Users inserted successfully");
  } catch (err) {
    console.error("Error inserting users:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedUsers();

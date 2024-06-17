const Student = require("../models/Student")
const User = require("../models/User")
const faker = require("@faker-js/faker").fakerEN_US
const FactoryBot = require('factory-bot');
require('dotenv').config()

const testUserPassword = faker.internet.password()
const factory = FactoryBot.factory
const factoryAdapter = new FactoryBot.MongooseAdapter()
factory.setAdapter(factoryAdapter)
factory.define('student',Student, {
    studentName: () => faker.studentName.name(),
    age: () => faker.person.studentAge(),
    educationLEvel: () => ["beginner","intermediate","advanced"][Math.floor(3 * Math.random())],
} 
)
factory.define('user', User, {
    name: () => faker.name.firstName() + ' ' + faker.name.lastName(),
    email: () => faker.internet.email(),
  password: () => faker.internet.password()
})

const seed_db = async () => {
  let testUser=null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST
    await Student.deleteMany({}) // deletes all student records
    await User.deleteMany({}) // and all the users
    testUser = await factory.create('user', { password: testUserPassword })
    await factory.createMany('student', 20, {createdBy: testUser._id}) // put 30 student entries in the database.
  } catch(e) {
    console.log("database error")
    console.log(e.message);
    throw(e);
  }
  return testUser;
}

module.exports = { testUserPassword, factory, seed_db }
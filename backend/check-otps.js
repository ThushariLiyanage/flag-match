const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
console.log('Connecting to MongoDB...');

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected!');
    
    // Import OTP model
    const OTP = require('./models/OTP');
    
    // Find recent OTPs
    const otps = await OTP.find({}).sort({ createdAt: -1 }).limit(5);
    
    console.log('\nRecent OTPs in database:');
    otps.forEach((otp, index) => {
      console.log(`\n${index + 1}. Email: ${otp.email}`);
      console.log(`   Code: ${otp.code}`);
      console.log(`   Created: ${otp.createdAt}`);
      console.log(`   Attempts: ${otp.attempts}`);
    });
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

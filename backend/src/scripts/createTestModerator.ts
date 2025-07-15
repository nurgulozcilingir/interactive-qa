import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { logger } from '../utils/logger';

dotenv.config();

async function createTestModerator() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('Connected to MongoDB');

    console.log('\n=== Creating Test Moderator ===\n');

    // Test moderator data
    const testModerator = {
      email: 'test@moderator.com',
      name: 'Test Moderator',
      password: 'password123',
      role: 'moderator'
    };

    // Check if user exists
    const existingUser = await User.findOne({ email: testModerator.email });
    if (existingUser) {
      console.log('❌ Test moderator already exists');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   ID: ${existingUser._id}`);
      return;
    }

    // Create user
    const user = new User(testModerator);
    await user.save();

    console.log('✅ Test moderator created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Password: password123`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);
    console.log('\nYou can now use these credentials to login.');

  } catch (error) {
    logger.error('Error creating test moderator:', error);
    console.log('\n❌ Failed to create test moderator');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the script
createTestModerator();
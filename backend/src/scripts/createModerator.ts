import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import User from '../models/User';
import { logger } from '../utils/logger';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createModerator() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('Connected to MongoDB');

    console.log('\n=== Create Moderator Account ===\n');

    // Get user input
    const email = await question('Email: ');
    const name = await question('Name: ');
    const password = await question('Password: ');
    const roleInput = await question('Role (moderator/admin) [default: moderator]: ');
    const role = roleInput || 'moderator';

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n❌ User already exists with this email');
      process.exit(1);
    }

    // Create user
    const user = new User({
      email,
      name,
      password,
      role,
    });

    await user.save();

    console.log('\n✅ Moderator created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);

    process.exit(0);
  } catch (error) {
    logger.error('Error creating moderator:', error);
    console.log('\n❌ Failed to create moderator');
    process.exit(1);
  }
}

// Handle password input (hide characters)
async function createModeratorWithHiddenPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info('Connected to MongoDB');

    console.log('\n=== Create Moderator Account ===\n');

    const email = await question('Email: ');
    const name = await question('Name: ');
    
    // For password, we'll use a simple approach
    const password = await question('Password (will be visible): ');
    
    const roleInput = await question('Role (moderator/admin) [default: moderator]: ');
    const role = roleInput || 'moderator';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n❌ User already exists with this email');
      process.exit(1);
    }

    const user = new User({
      email,
      name,
      password,
      role,
    });

    await user.save();

    console.log('\n✅ Moderator created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);

    process.exit(0);
  } catch (error) {
    logger.error('Error creating moderator:', error);
    console.log('\n❌ Failed to create moderator');
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

// Run the script
createModeratorWithHiddenPassword();
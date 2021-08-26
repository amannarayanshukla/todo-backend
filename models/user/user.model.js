const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    userId: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
      select: false,
    },
    accessToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.index({ userId: 1 });
UserSchema.index({ email: 1 });

// Encrypt password using bcrypt
// eslint-disable-next-line consistent-return
UserSchema.pre('save', async function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  const salt = await bcrypt.genSalt(saltRounds);
  // hash the password using our new salt and override the current password with the hashed one
  user.password = await bcrypt.hash(user.password, salt);

  user.accessToken = await user.createAccessToken();
  next();
});

// Compare password
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create access token
UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      userId: this.userId,
      phone: this.phone,
      role: this.role || 'user',
    },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: '5m' }, // TODO: change the limit
  );
};

// Verify JWT token
UserSchema.methods.verifyJWTToken = function (token, secret) {
  return jwt.verify(token, secret);
};

module.exports = mongoose.model('Users', UserSchema);

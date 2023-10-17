const 
  mongoose = require('mongoose'),
  validator = require('validator'),
  bcrypt = require('bcryptjs')
;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [50, 'A name cannot be more than 50 characters'],
    minlength: [3, 'A name cannot be less than 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email to the account'],
    unique: true,
    validate: [validator.isEmail, 'please provide a valid email in the format my@email.com']
  },
  password: {
    type: String,
    required: [true, 'A password is required to create an account']
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password') || !this.isNew) return next();
  // const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, 10); // generated salt above can be used in place of the 10 
  next();
});

// Checking if password submitted is correct
userSchema.methods.confirmPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
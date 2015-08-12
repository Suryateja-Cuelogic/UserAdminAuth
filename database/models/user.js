var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: String,
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	email: { type: String, required: true, index: { unique: true} }
});

UserSchema.pre('save', function(next) {
    var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	    if (err) return next(err);

	    // hash the password using our new salt
	    bcrypt.hash(user.password, salt, function(err, hash) {
	        if (err) return next(err);
	        // override the cleartext password with the hashed one
	        console.log(user.password);
	        console.log(hash);
	        user.password = hash;
	        next();
	    });
	});


});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);

var userCollection = new User({
	first_name: "Mahidhara",
	last_name: "Suryateja",
	username: "surya@cue",
	password: '123456',
	email: "suryateja.mahidhara@cuelogic.co.in"
});

// save user to database
userCollection.save(function(err) {
    if (err) throw err;

	// fetch user and test password verification
	User.findOne({ username: 'surya@cue' }, function(err, user) {
	    if (err) throw err;

	    // test a matching password
	    user.comparePassword('123456', function(err, isMatch) {
	        if (err) throw err;
	        console.log('123456:', isMatch); // -&gt; 123456: true
	    });

	    // test a failing password
	    user.comparePassword('123456', function(err, isMatch) {
	        if (err) throw err;
	        console.log('123456:', isMatch); // -&gt; 123456: false
	    });
	});
});





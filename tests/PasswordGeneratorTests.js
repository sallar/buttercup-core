var lib = require("../source/module.js"),
	PasswordGenerator = lib.PasswordGenerator;

module.exports = {

	setUp: function(cb) {
		this.passwordGenerator = new PasswordGenerator();

		cb();
	},

	generatePassword: {

		testThrowsExceptionNoCharsets: function(test) {
			var exc = null,
				pass = null;
			try {
				pass = this.passwordGenerator.generatePassword();
			} catch (e) {
				exc = e;
			}
			test.strictEqual(pass, null, "No password should be returned");
			test.notStrictEqual(exc, null, "Exception should be thrown");
			test.done();
		},

		testGeneratesDefaultLength: function(test) {
			var defaultLength = PasswordGenerator.DefaultPasswordLength;
			test.ok(defaultLength > 0, "Default length should be greater than 0");
			this.passwordGenerator
				.useCharacterSet(PasswordGenerator.CharacterSet.numbers)
				.useCharacterSet(PasswordGenerator.CharacterSet.lowerCaseLetters);
			var pass = this.passwordGenerator.generatePassword();
			test.strictEqual(pass.length, defaultLength, "Default generated length should be used");
			test.done();
		}

	}

};
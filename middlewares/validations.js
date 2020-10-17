const { sendError } = require("../utility/helpers");
const { BAD_REQUEST } = require("../utility/statusCodes");

let emailRegex = /^\S+@\S+\.\S+/,
	passwordRegex = /^[\S]{8,}/;

emailAndPasswordValidation = (email, password) => {
	let invalidFields = "", count = 0;
	if (!emailRegex.test(String(email))) {
		invalidFields += " Email,";
		count += 1;
	}
	if(!passwordRegex.test(String(password))) {
		invalidFields += " Password,";
		count += 1;
	}
	let verb = "is";
	if (count > 1) verb = "are";
	if (count != 0) {
		invalidFields = invalidFields.substring(1, invalidFields.length - 1);
		let message = `${invalidFields} ${verb} invalid!!`;
		return sendError(res, message, BAD_REQUEST);
	}
	return next();
};

module.exports.userRegisterValidation = (req, res, next) => {
	let { name, email, password } = req.body;
	if (!name | !email | !password)
		return sendError(res, "Name, email and password are mandatory!!", BAD_REQUEST);
	return emailAndPasswordValidation(email, password);
};
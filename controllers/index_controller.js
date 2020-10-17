// import http status codes
const {
	BAD_REQUEST,
	NOT_AUTHORIZED,
	FORBIDDEN,
	NOT_FOUND,
	NOT_ACCEPTABLE
} = require("../utility/statusCodes");

// import helper functions
const { sendError, sendSuccess } = require("../utility/helpers");

module.exports.index = (req, res) => {
	sendSuccess(res, "Welcome to the API");
};

module.exports.register = async (req, res) => {
	let { name, email, password } = req.body;
	email = String(email).trim().toLowerCase();
	try {
		let user = await User.findOne({ email });
		if (user)
			return sendError(res, "User already exists!!", BAD_REQUEST);
				let newUser = {
					name,
					email,
					password
				};
				const salt = await bcrypt.genSalt(10);
				newUser.password = await bcrypt.hash(newUser.password, salt);
				await User.create(newUser);
				return sendSuccess(res, "User registered successfully!!");
		}
		catch (err) {
			consola.error({ message: err, badge: true });
			return sendError(res, err.message, 500);
		}
}

module.exports.login = async (req, res) => {
	let { email, password } = req.body;
	email = email.toLowerCase();
	const user = await User.findOne({ email });
	if (!user) return sendError(res, "User not found!!", BAD_REQUEST);
	const isPwdValid = await bcrypt.compare(password, user.password);
	if (!isPwdValid) return sendError(res, "Invalid credentials!!", BAD_REQUEST);
	const { _id, name, role } = user;
	const data = { _id, name, email, role };
	const token = jwt.sign({ type: "user", data }, JWT_PRIVATE_KEY, {
		expiresIn: 604800 // for 1 week time in seconds
	});
	return sendSuccess(res, "Logged in successfully!!", token);
}

module.exports.openAccess = async (req, res) => {
	const user = await User.findById(req.user.data._id);
	if (!user) return sendError(res, "User not found!!", BAD_REQUEST);
	const { _id, name, email, role } = user;
	const data = { _id, name, email, role };
	return sendSuccess(res, data);
}

module.exports.restrictedAccess = async (req, res) => {
	const user = await User.findById(req.user.data._id);
	if (!user) return sendError(res, "User not found!!", BAD_REQUEST);
	return sendSuccess(res, {message: `Welcome ${user.name}! You are logged in as admin!`});
}
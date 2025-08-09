const { v4: uuidv4 } = require('uuid')
const User = require('../models/user')
const { setUser, getUser } = require('../service/auth')

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body
    await User.create({
        name,
        email,
        password
    });
    return res.redirect('/');
    // return res.render("home")
}

async function handleUserLogIn(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({ email, password });
    console.log("User", user);
    if (!user) {
        return res.render("login", { error: "Invalid Credentials" })
    }
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    return res.redirect("/")

}


module.exports = {
    handleUserSignUp,
    handleUserLogIn
}


const loginout = function (req, res) {
    //删除session
    delete req.session["s_id"];
    res.redirect("/login");
}

module.exports = loginout;
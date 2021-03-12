const Menu = require("../../models/menu");


function homeController() {
    return {
        async index(req, res) {
            const menus = await Menu.find()
            console.log(menus)
            return res.render("home", { menus: menus })




        }

    }
}


module.exports = homeController;
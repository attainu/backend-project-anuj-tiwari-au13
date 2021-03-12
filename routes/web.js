const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController")
const orderController = require("../app/http/controllers/customers/orderController")

const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')


const adminOrderController = require("../app/http/controllers/admin/orderController")
const statusController = require("../app/http/controllers/admin/statusController")


function initRoutes(app) {


    //ROUTES

    // home route
    app.get("/", homeController().index)



    //cart route
    app.get("/cart", cartController().index)




    //login route
    app.get("/login", guest, authController().login)

    app.post("/login", authController().postLogin)



    //Register route
    app.get("/register", guest, authController().register)

    app.post("/register", authController().postRegister)

    //Logout
    app.post("/logout", authController().logout)

    //Update Cart
    app.post("/update-cart", cartController().update)




    // Customer routes
    app.post("/orders", auth, orderController().store)

    app.get('/customers/orders', auth, orderController().index)

    app.get('/customers/orders/:id', auth, orderController().show)


    // Admin routes 

    app.get('/admin/orders', admin, adminOrderController().index)

    app.post('/admin/order/status', admin, statusController().update)






}


module.exports = initRoutes;


module.exports = initRoutes;
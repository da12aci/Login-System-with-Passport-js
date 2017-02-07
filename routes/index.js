let express = require('express');
let router = express.Router();


//Get Homepage
router.get('/',ensureAuthenicated,function(req,res){
    res.render('index');
});


function ensureAuthenicated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect('/users/login');
    }
}

module.exports = router;
/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Middleware function to check if the user is authenticated
**********************************************************/
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  
  module.exports = checkAuthenticated;
  
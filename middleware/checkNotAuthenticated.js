/*********************************************************** 
Author              : Navin Raaj
Last Modified Date  : 2023-05-31
Description         : Middleware function to check if the user is not authenticated
**********************************************************/
module.exports = function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  }
  
const MetaError = require('../errors/MetaError')
const NotFound = (req,res,next)=>{
    throw new MetaError.NotFound(`Sorry!!...Page you are trying to access is Not Found..... URL:${req.url}`)
}
module.exports = NotFound
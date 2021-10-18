function authorize(permissionRoles){
    return (req,res, next)=>{

        // First get the user from request
        const user = req.user;

        // check if atleast one role of that user matches with permissionRoles
        let allowed = false
        const allowedArray = user.roles.map(role => {
            if(permissionRoles.includes(role)){
                allowed = true
            }
        })

        console.log("allowed", allowed)
        // If not then throw and error
        if(!allowed){
            return res.status(403).send({message:"You are not allowed to access this page"})
        }
        // If yes then he is allowed
        return next()
    }
}

module.exports = authorize
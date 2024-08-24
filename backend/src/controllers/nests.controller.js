const { Nest, Egg } = require("../models")
const { ApiResponse } = require("../utils/ApiResponse")

const nestDetails = async (req, res) => {
    try {
        const response = await Nest.find()
        res
        .status(201)
        .json(
            new ApiResponse(201, response, "Nest are found")
        )
    } catch (error) {
        res
        .status(error.status || 401)
        .json(
            new ApiResponse(error.status || 401 , null, error.message || "Error while fetching nest")
        )
    }
}

const getNestOfEgg = async (req, res) => {
    const { id } = req.params;
    try {
        const allNests = await Nest.find()
        //console.log('ok')
        //console.log('allNests: ', allNests)
        const nestContainEgg = allNests.filter(nest => nest.eggs.includes(id))
        //console.log( 'data: ', nestContainEgg)
        res
        .status(201)
        .json(
            new ApiResponse(201, nestContainEgg, "Nest are found")
        )
    } catch (error) {
        //console.log(error.message)
        res
        .status(error.status || 401)
        .json(
            new ApiResponse(error.status || 401 , null, error.message || "Error while fetching nest")
        )
    }
}

const getEggsOfNest = async (req, res) => {
    const { id } = req.params;
    try {
   
       const allEggs = await Egg.find()
  
       const selectedEggs = allEggs.filter(egg => egg.parentNest[0].toString() === id.toString())
 
       res
       .status(201)
       .json(
           new ApiResponse(201, selectedEggs, "Eggs are found")
       )
    } catch (error) {
        //console.log(error.message)
        res
        .status(error.status || 401)
        .json(
            new ApiResponse(error.status || 401 , null, error.message || "Error while fetching nest")
        )
    }
}


module.exports = {
    nestDetails,
    getNestOfEgg,
    getEggsOfNest
}
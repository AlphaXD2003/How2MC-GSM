const {model, Schema, Types} = require('mongoose')


const locationNodesSchema = new Schema({
    l_id: {
        type: Number,
        required: true
    },
    resources:{
        allocatedRam: {
            type: Number,
            required: true,

        },
        allocatedDisk: {
            type: Number,
            required: true,

        },
        isInMaintenance:{
            type: Boolean,
            required: true
        },
        usedRam:{
            type: Number,
            required: true,
        },
        usedDisk: {
            type: Number,
            required: true,
        },
        numberOfServers:{
            type: [Number],
            required: false
        }

    }
},{
    timestamps: true
})

const LocationNodesModel = model('LocationNodesModel', locationNodesSchema)

module.exports = LocationNodesModel
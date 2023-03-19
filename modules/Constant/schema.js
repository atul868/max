const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constantSchema = new Schema(
    {
        mobile:{type:String},
        email:{type:String},
        propertyNature: [{ type: String/*, enum: ['Buy', 'Resale', 'Rent']*/ }],
        projectSpecilization: [{ type: String /*,enum: ['Residential', 'Commercial', 'Land/Plots', 'Buildings']*/ }],
        specilizationType: { type: String/*, enum: ['Group Housing', 'House/Villa', 'Builder Floor', 'Plot/Land', 'Studio/Suites', 'Serviced Apartment', 'Farm House'] */ },
        unit: [{ type: String }],
        unitType: [{ type: String/*, enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'] */ }],
        floorRange: [{ type: Number }],
        furnishing: [{ type: String/*, enum: ['Bareshell', 'UnFurnished', 'Semi Furnished', 'Fully Furnished', 'Full Furnished with Furniture']*/ }],
        additionalRooms: [{ type: String }],
        facing: [{ type: String/*, enum: ['Park Facing', 'Road Facing', 'Park & Corner', 'Road & Corner', 'None']*/ }],
        propertyEntry: [{ type: String/*, enum: ['North', 'East', 'West', 'South', 'North East', 'South East', 'North West', 'South West',]*/ }],
        stageOfConstruction: [{ type: String/*, enum: ['New Launched', 'Under Construction', 'Nearing Possession', 'OC Applied', 'Ready To Move']*/ }],
        status: [{ type: String }],
        sizes: [{ type: String }],
        residential: [{ type: String }],
        commercial: [{ type: String }],
        landPloats: [{ type: String }],
        building: [{ type: String }],
        dealIn: [{ type: String }],
        selector: [{ type: String }],
        specilizationSubType: [{ type: String }],
        subCategory: [{ type: String }],
        frontUnit: [{ type: String }],
        depthUnit: [{ type: String }],
        roadInFront: [{ type: String }],
        aboutUs: { type: String },
        helpQ: [{ type: String }],
        helpAns: [{ type: String }],
        cornerPlot: [{ type: Boolean }],
        propertyAge: [{ type: String }],
        leasedTo: [{ type: String }],
        brand: [{ type: String }],
        ownershipType: [{ type: String/*, enum: ['Free Hold', 'Less Hold', 'GPA', 'Cooeprative Society']*/ }],
        parkingFacilities: [{ type: String/*, enum: ['Common Public Parking', 'Reserved Open Parking', 'Stilt Parking', 'Back Stilt Parking']*/ }],
        distressSale:[{ type: String }],
        totalFloorBuilt: [{ type: Number }],
        directOwnerTouch: [{ type: Boolean }],
        vancatPreleased: [{ type: String }],
        groundCoverage: [{ type: String }],
        propertyOnFloor: [{ type: String }],
        heightUnit: [{ type: String }],
        propertyManagedBy: [{ type: String }],
        totalConstructedFloorInProperty: [{ type: Number }],
        maintenaceExtra: [{ type: Boolean }],
        GivenTo: [{ type: String }],
        space: [{ type: String }],
        Occupancy: [{ type: String }],
        privacyPolicy: [{ type: String }],
    },
    { timestamps: true }
);




const constant = mongoose.model("constant", constantSchema);
module.exports = constant;






const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const propertySchema = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        propertyProjectId: { type: Schema.Types.ObjectId, ref: 'propertyProjects' },
        propertyDeveloperId: { type: Schema.Types.ObjectId, ref: 'propertyDevelopers' },
        propertyImage: [{ propertyImage: { type: String }, verifiedflag: { type: Boolean, default: false } }],
        pdf: { type: String },
        propertyNature: { type: String/*, enum: ['Buy', 'Resale', 'Rent']*/ },
        chooseCategory: { type: String /*,enum: ['Residential', 'Commercial', 'Land/Plots', 'Buildings']*/ },
        commission: { type: String },
        propertyLocalityAddress: { type: String },
        propertyStateAddress: { type: String },
        propertyCityAddress: { type: String },
        constructedAreaUnit: { type: String },
        pdfFileName: { type: String },
        plotAreaUnit: { type: String },
        plotAreaVal: { type: Number },
        constructedAreaVal: { type: Number },
        propertyType: { type: String/*, enum: ['Group Housing', 'House/Villa', 'Builder Floor', 'Plot/Land', 'Studio/Suites', 'Serviced Apartment', 'Farm House'] */},
        unitType: { type: String/*, enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK'] */},
        // totalFloor: { type: Number },
        floorNo: { type: Number },
        heightVal: { type: Number },
        topFloorProperty: { type: Boolean, default: false },
        groundFloorProperty: { type: Boolean, default: false },
        apartmentFurnishing: { type: String/*, enum: ['Bareshell', 'UnFurnished', 'Semi Furnished', 'Fully Furnished', 'Full Furnished with Furniture']*/ },
        additionalFacilities: [{ type: String }],
        parkingFacilities: { type: String/*, enum: ['Common Public Parking', 'Reserved Open Parking', 'Stilt Parking', 'Back Stilt Parking']*/ },
        facingType: { type: String/*, enum: ['Park Facing', 'Road Facing', 'Park & Corner', 'Road & Corner', 'None']*/ },
        facingDirection: { type: String/*, enum: ['North', 'East', 'West', 'South', 'North East', 'South East', 'North West', 'South West',]*/ },
        stageOfConstruction: { type: String/*, enum: ['New Launched', 'Under Construction', 'Nearing Possession', 'OC Applied', 'Ready To Move']*/ },
        ownershipType: { type: String/*, enum: ['Free Hold', 'Less Hold', 'GPA', 'Cooeprative Society']*/ },
        uspDescription: {
            usp1: { type: String },
            usp2: { type: String },
            usp3: { type: String }
        },
        status: { type: String },
        sizes: [{ type: String }],
        listingTillDate:{type:Date},
        constructedAreaUnit: { type: String },
        description: { type: String },
        saleDealDone: { type: Boolean, default: false },
        distressSale: { type: Boolean, default: false },
        price: { type: Number },
        otherCharge: { type: Number },
        negotiable: { type: Boolean, default: false },
        propertyAsHotDeal: { type: Boolean, default: false },
        propertyAsPrimeListing: { type: Boolean, default: false },
        isSold: { type: Boolean, default: false },

        roadInFrontUnit: { type: String },
        roadInFrontVal: { type: String },
        cornerPloat: { type: Boolean },
        frontUnit: { type: String },
        frontAreaVal: { type: Number },
        depthUnit: { type: String },
        depthAreaVal: { type: Number },
        propertyAge: { type: String },
        leasedTo: [{ type: String }],
        brand: [{ type: String }],

        totalFloorBuilt: { type: Number },
        directOwnerTouch: { type: Boolean },
        vancatPreleased: { type: String },
        groundCoverage: { type: String },
        propertyOnFloor: { type: String },
        heightUnit: { type: String },
        propertyManagedBy: { type: String },
        totalConstructedFloorInProperty: { type: Number },
        maintenaceExtra:{ type: Boolean },
        GivenTo: [{ type: String }],
        Occupancy: { type: String },
        space: { type: String },

        isActive: { type: Boolean, default: true },
        plotArea: {
            SQFT: { type: Number },
            SQMT: { type: Number },
            SQYD: { type: Number },
            Bigha: { type: Number },
            Marla: { type: Number },
            Katha: { type: Number },
            Acres: { type: Number },
        },
        constructedArea: {
            SQFT: { type: Number },
            SQMT: { type: Number },
            SQYD: { type: Number },
            Bigha: { type: Number },
            Marla: { type: Number },
            Katha: { type: Number },
            Acres: { type: Number },
        },
    },
    { timestamps: true }
);

const propertyReportSchema = new Schema(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'properties' },
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        report: { type: String },
        isActive: { type: Boolean, default: false },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }

);


const property = mongoose.model("property", propertySchema);
const propertyReport = mongoose.model("propertyReport", propertyReportSchema);


module.exports = property;
module.exports = propertyReport;

module.exports = {
    property, propertyReport
}

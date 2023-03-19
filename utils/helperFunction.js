const message = require("../config/message");
const response = require("../utils/response");

exports.plotAreaInitialisation = function (unit, Area) {
    try {
        if (unit == "sqft" || unit == "SQFT") {
            const plotArea = {
                plotArea: {
                    SQFT: Area,
                    SQMT: Area * 0.093,
                    SQYD: Area * 0.111,
                    Bigha: Area * 0.00003673094582,
                    Katha: Area * 0.00367309,
                    Marla: Area * 0.00073,
                    Acers: Area * 0.000023
                }
            }
            return plotArea;
        }
        else if (unit == "sqmt" || unit == "SQMT") {

            const plotArea = {
                plotArea: {
                    SQFT: Area * 10.764,
                    SQMT: Area,
                    SQYD: Area * 1.195991,
                    Bigha: Area * 0.0004,
                    Katha: Area * 0.007909,
                    Marla: Area * 0.039537,
                    Acers: Area * 0.00024710882
                }
            }
            return plotArea;
        }
        else if (unit == "sqyd" || unit == "SQYD") {
            const plotArea = {
                plotArea: {
                    SQFT: Area * 9.00,
                    SQMT: Area * 0.836,
                    SQYD: Area,
                    Bigha: Area * 0.000333,
                    Katha: Area * 0.0330578,
                    Marla: Area * 0.033058,
                    Acers: Area * 0.000206
                }
            }
            return plotArea;
        }
        else if (unit == "bigha" || unit == "BIGHA") {
            const plotArea = {
                plotArea: {
                    SQFTre: Area * 26910.66,
                    SQMTre: Area * 2500,
                    SQYDre: Area * 2990,
                    Bighare: Area,
                    Kathare: Area * 20,
                    marlare: Area * 99.1736,
                    Acersre: Area * 0.625
                }
            }
            return plotArea;
        }
        else if (unit == "marla" || unit == "MARALA") {
            const plotArea = {
                plotArea: {
                    SQFT: Area * 272.250,
                    SQMT: Area * 25.29285264,
                    SQYD: Area * 30.2500,
                    Bigha: Area * 0.010083,
                    Katha: Area * 0.200037,
                    Marla: Area,
                    Acers: Area * 0.00625
                }
            }
            return plotArea;
        }
        else if (unit == "katha" || unit == "KATHA") {
            const plotArea = {
                plotArea: {
                    SQFT: Area * 600,
                    SQMT: Area * 126.44,
                    SQYD: Area * 80,
                    Bigha: Area * 0.050407,
                    Katha: Area,
                    Marla: Area * 4.999072,
                    Acers: Area * 0.01652892561983471
                }
            }
            return plotArea;
        }
        else if (unit == "acres" || unit == "ACRES") {
            const plotArea = {
                plotArea: {
                    SQFT: Area * 43560.057,
                    SQMT: Area * 4046.86,
                    SQYD: Area * 4840.0063,
                    Katha: Area * 32.005,
                    Marla: Area * 159.999,
                    Acers: Area
                }
            }
            return plotArea;

        }
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


exports.constructedAreaInitialisation = function (unit, Area) {
    try {
        if (unit == "sqft" || unit == "SQFT") {
            const constructedArea = {
                constructedArea: {
                    SQFT: Area,
                    SQMT: Area * 0.093,
                    SQYD: Area * 0.111,
                    Bigha: Area * 0.00003673094582,
                    Katha: Area * 0.00367309,
                    Marla: Area * 0.00073,
                    Acers: Area * 0.000023
                }
            }
            return constructedArea;
        }
        else if (unit == "sqmt" || unit == "SQMT") {

            const constructedArea = {
                constructedArea: {
                    SQFT: Area * 10.764,
                    SQMT: Area,
                    SQYD: Area * 1.195991,
                    Bigha: Area * 0.0004,
                    Katha: Area * 0.007909,
                    Marla: Area * 0.039537,
                    Acers: Area * 0.00024710882
                }
            }
            return constructedArea;
        }
        else if (unit == "sqyd" || unit == "SQYD") {
            const constructedArea = {
                constructedArea: {
                    SQFT: Area * 9.00,
                    SQMT: Area * 0.836,
                    SQYD: Area,
                    Bigha: Area * 0.000333,
                    Katha: Area * 0.0330578,
                    Marla: Area * 0.033058,
                    Acers: Area * 0.000206
                }
            }
            return constructedArea;
        }
        else if (unit == "bigha" || unit == "BIGHA") {
            const constructedArea = {
                constructedArea: {
                    SQFTre: Area * 26910.66,
                    SQMTre: Area * 2500,
                    SQYDre: Area * 2990,
                    Bighare: Area,
                    Kathare: Area * 20,
                    marlare: Area * 99.1736,
                    Acersre: Area * 0.625
                }
            }
            return constructedArea;
        }
        else if (unit == "marla" || unit == "MARLA") {
            const constructedArea = {
                constructedArea: {
                    SQFT: Area * 272.250,
                    SQMT: Area * 25.29285264,
                    SQYD: Area * 30.2500,
                    Bigha: Area * 0.010083,
                    Katha: Area * 0.200037,
                    Marla: Area,
                    Acers: Area * 0.00625
                }
            }
            return constructedArea;
        }
        else if (unit == "katha" || unit == "KATHA") {
            const constructedArea = {
                constructedArea: {
                    SQFT: Area * 600,
                    SQMT: Area * 126.44,
                    SQYD: Area * 80,
                    Bigha: Area * 0.050407,
                    Katha: Area,
                    Marla: Area * 4.999072,
                    Acers: Area * 0.01652892561983471
                }
            }
            return constructedArea;
        }
        else if (unit == "acres" || unit == "ACRES") {
            const constructedArea = {
                constructedArea: {
                    SQFT: Area * 43560.057,
                    SQMT: Area * 4046.86,
                    SQYD: Area * 4840.0063,
                    Katha: Area * 32.005,
                    Marla: Area * 159.999,
                    Acers: Area
                }
            }
            return constructedArea;

        }
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};




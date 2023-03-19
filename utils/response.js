
exports.success = function (code, message, data) {
    const SucessResponse = {
        message: message,
        status: 'Success',
        code: code,
        data: data,
    }; 
    return SucessResponse;
};

exports.Success = function (code,totalCount, message, data) {
    const SucessResponse = {
        message: message,
        status: 'Success',
        code: code,
        totalCount:totalCount,
        data: data,
    }; 
    return SucessResponse;
};

exports.failure = function (code, message, data) {
    const FailureResponse = {
        message: message,
        status: 'Failure',
        code: code,
        data: data,
    };
    return FailureResponse;
};



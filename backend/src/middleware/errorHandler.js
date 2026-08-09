// // const errorHandler = (err, req, res, next) => {
// //     console.error("Error:", err);

// //     // Handle database connection errors
// //     if (
// //         err.code === "ServiceUnavailable" ||
// //         err.code === "SessionExpired"
// //     ) {
// //         return res.status(503).json({
// //             success: false,
// //             message: "Graph database is currently unavailable."
// //         });
// //     }

// //     // Handle invalid requests
// //     if (err.name === "ValidationError") {
// //         return res.status(400).json({
// //             success: false,
// //             message: err.message
// //         });
// //     }

// //     // Default server error
// //     return res.status(500).json({
// //         success: false,
// //         message: "Something went wrong on the server."
// //     });
// // };

// // module.exports = errorHandler;


// function errorHandler(err, req, res, next) {
//     console.error("❌ Error:", err);

//     if (
//         err.code === "ServiceUnavailable" ||
//         err.code === "SessionExpired" ||
//         err.code === "Neo4jError"
//     ) {
//         return res.status(503).json({
//             success: false,
//             message: "Graph database is currently unavailable."
//         });
//     }

//     res.status(500).json({
//         success: false,
//         message: "Something went wrong on the server."
//     });
// }

// module.exports = errorHandler;


function errorHandler(err, req, res, next) {
    console.error("❌ Error:", err);

    res.status(500).json({
        success: false,
        message: err.message
    });
}

module.exports = errorHandler;
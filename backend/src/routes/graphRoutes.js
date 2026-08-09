const express = require("express");

const graphController =
    require("../controllers/graphControllers");

const router = express.Router();

router.get(
    "/services/:name/dependencies",
    graphController.getDependencies
);

router.get(
    "/services/:name/impact",
    graphController.getImpact
);

router.get(
    "/packages/:name/impact",
    graphController.getPackageImpact
);

router.get(
    "/path",
    graphController.findPath
);

module.exports = router;


// nothing
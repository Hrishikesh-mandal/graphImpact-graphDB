const graphService = require("../services/graphServices");

async function getDependencies(req, res, next) {
    try {
        const { name } = req.params;

        const dependencies =
            await graphService.getServiceDependencies(name);

        res.status(200).json({
            success: true,
            data: dependencies
        });
    } catch (error) {
        next(error);
    }
}

async function getImpact(req, res, next) {
    try {
        const { name } = req.params;

        const affectedServices =
            await graphService.getServiceImpact(name);

        res.status(200).json({
            success: true,
            data: {
                service: name,
                affectedServices,
                totalAffected: affectedServices.length
            }
        });
    } catch (error) {
        next(error);
    }
}

async function getPackageImpact(req, res, next) {
    try {
        const { name } = req.params;

        const impact =
            await graphService.getPackageImpact(name);

        res.status(200).json({
            success: true,
            data: impact
        });
    } catch (error) {
        next(error);
    }
}

async function findPath(req, res, next) {
    try {
        const { source, target } = req.query;

        if (!source || !target) {
            return res.status(400).json({
                success: false,
                message: "source and target are required"
            });
        }

        const path =
            await graphService.findPath(source, target);

        res.status(200).json({
            success: true,
            data: path
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDependencies,
    getImpact,
    getPackageImpact,
    findPath
};
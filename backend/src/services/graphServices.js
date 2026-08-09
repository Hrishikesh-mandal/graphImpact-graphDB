const driver = require("../config/db");

const {
    GET_SERVICE_DEPENDENCIES,
    GET_SERVICE_IMPACT,
    GET_PACKAGE_USERS,
    GET_PACKAGE_IMPACT,
    FIND_PATH
} = require("../queries/graphQueries");

async function runQuery(query, parameters = {}) {
    const session = driver.session();

    try {
        const result = await session.run(
            query,
            parameters
        );

        return result.records;
    } finally {
        await session.close();
    }
}

async function getServiceDependencies(name) {
    const records = await runQuery(
        GET_SERVICE_DEPENDENCIES,
        { name }
    );

    return records.map(record =>
        record.get("dependency")
    );
}

async function getServiceImpact(name) {
    const records = await runQuery(
        GET_SERVICE_IMPACT,
        { name }
    );

    return records.map(record => ({
        ...record.get("service"),
        depth: record.get("depth").toNumber()
    }));
}

async function getPackageUsers(name) {
    const records = await runQuery(
        GET_PACKAGE_USERS,
        { name }
    );

    return records.map(record =>
        record.get("service")
    );
}

async function getPackageImpact(name) {
    const records = await runQuery(
        GET_PACKAGE_IMPACT,
        { name }
    );

    return records.map(record => ({
        ...record.get("service"),
        depth: record.get("depth").toNumber()
    }));
}

async function findPath(source, target) {
    const records = await runQuery(
        FIND_PATH,
        { source, target }
    );

    if (records.length === 0) {
        return null;
    }

    const path = records[0].get("path");

    // Collect nodes without duplicates
    const nodes = new Map();

    path.segments.forEach((segment) => {
        const startNode = segment.start;
        const endNode = segment.end;

        nodes.set(startNode.elementId, {
            id: startNode.elementId,
            labels: startNode.labels,
            properties: startNode.properties
        });

        nodes.set(endNode.elementId, {
            id: endNode.elementId,
            labels: endNode.labels,
            properties: endNode.properties
        });
    });

    // Convert relationships
    const relationships = path.segments.map((segment) => {
        const relationship = segment.relationship;

        return {
            id: relationship.elementId,
            type: relationship.type,
            startNode: relationship.startNodeElementId,
            endNode: relationship.endNodeElementId,
            properties: relationship.properties
        };
    });

    return {
        length: path.length,
        nodes: Array.from(nodes.values()),
        relationships
    };
}

module.exports = {
    getServiceDependencies,
    getServiceImpact,
    getPackageUsers,
    getPackageImpact,
    findPath
};
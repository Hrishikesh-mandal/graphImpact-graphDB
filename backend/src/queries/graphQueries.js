// const GET_SERVICE_DEPENDENCIES = `
//     MATCH (s:Service {name: $name})
//           -[:DEPENDS_ON]->(dependency)
//     RETURN dependency
// `;

// const GET_SERVICE_IMPACT = `
//     MATCH path =
//         (dependency)
//         -[:DEPENDS_ON*1..5]->
//         (s:Service {name: $name})
//     RETURN path
// `;

// module.exports = {
//     GET_SERVICE_DEPENDENCIES,
//     GET_SERVICE_IMPACT
// };



const GET_SERVICE_DEPENDENCIES = `
    MATCH (s:Service {name: $name})
          -[:DEPENDS_ON]->(dependency:Service)
    RETURN dependency {
        .name,
        .language,
        .team
    } AS dependency
    ORDER BY dependency.name
`;

const GET_SERVICE_IMPACT = `
    MATCH path =
        (affected:Service)
        -[:DEPENDS_ON*1..5]->
        (target:Service {name: $name})
    RETURN
        affected {
            .name,
            .language,
            .team
        } AS service,
        length(path) AS depth
    ORDER BY depth, service.name
`;

const GET_PACKAGE_USERS = `
    MATCH (service:Service)-[:USES]->(package:Package {name: $name})
    RETURN service {
        .name,
        .language,
        .team
    } AS service
    ORDER BY service.name
`;

const GET_PACKAGE_IMPACT = `
    MATCH path =
        (service:Service)-[:USES]->(package:Package)
        -[:DEPENDS_ON*0..5]->
        (target:Package {name: $name})
    RETURN
        service {
            .name,
            .language,
            .team
        } AS service,
        length(path) AS depth
    ORDER BY depth, service.name
`;

const FIND_PATH = `
    MATCH path =
        (source:Service {name: $source})
        -[:DEPENDS_ON*1..10]->
        (target:Service {name: $target})
    RETURN path
    LIMIT 1
`;

module.exports = {
    GET_SERVICE_DEPENDENCIES,
    GET_SERVICE_IMPACT,
    GET_PACKAGE_USERS,
    GET_PACKAGE_IMPACT,
    FIND_PATH
};
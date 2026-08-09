import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export const getServiceDependencies = async (serviceName) => {
    const response = await api.get(
        `/services/${serviceName}/dependencies`
    );

    return response.data;
};

export const getServiceImpact = async (serviceName) => {
    const response = await api.get(
        `/services/${serviceName}/impact`
    );

    return response.data;
};

export const getPackageImpact = async (packageName) => {
    const response = await api.get(
        `/packages/${packageName}/impact`
    );

    return response.data;
};

export const findPath = async (source, target) => {
    const response = await api.get("/path", {
        params: {
            source,
            target
        }
    });

    return response.data;
};

export default api;
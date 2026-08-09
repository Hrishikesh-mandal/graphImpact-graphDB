import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const getServiceDependencies = async (serviceName) => {
    const response = await api.get(
        `/api/services/${serviceName}/dependencies`
    );

    return response.data;
};

export const getServiceImpact = async (serviceName) => {
    const response = await api.get(
        `/api/services/${serviceName}/impact`
    );

    return response.data;
};

export const getPackageImpact = async (packageName) => {
    const response = await api.get(
        `/api/packages/${packageName}/impact`
    );

    return response.data;
};

export const findPath = async (source, target) => {
    const response = await api.get("/api/path", {
        params: {
            source,
            target
        }
    });

    return response.data;
};

export default api;
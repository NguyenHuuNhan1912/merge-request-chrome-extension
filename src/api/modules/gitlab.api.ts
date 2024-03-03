import publicClient from "../config/api.service";

const gitlabApi = {
    
    getBranchs: (id: number, params: any) => {
        return publicClient.get(`projects/${id}/repository/branches`, {params});
    },

    getUser: () => {
        return publicClient.get(`user`);
    }, 
    getProjects: (params: any) => {
        return publicClient.get('projects', {params});
    }
}

export default gitlabApi;
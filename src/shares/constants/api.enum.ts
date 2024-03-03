export const YOUR_DOMAIN = "example";

export enum BASE_URL {
    BASE_URL_API = `https://gitlab.${YOUR_DOMAIN}.com/api/v4`,
}

export const BASE_URL_MERGER_REQUEST = {
    BASE_URL: `https://gitlab.${YOUR_DOMAIN}.com`,
    getBaseUrlSrcBranch: (id: number, srcBranch: string) => `-/merge_requests/new?utf8=✓&merge_request[source_project_id]=${id}&merge_request[source_branch]=${srcBranch}`,
    getBaseUrlTargetBranch: (id: number, targetBranch: string) => `&merge_request[target_project_id]=${id}&merge_request[target_branch]=${targetBranch}`
};
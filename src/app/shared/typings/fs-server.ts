import { Timeline } from "./search";

export interface RequestBody {
    user: authPwdOptions | authApiOptions,
    timeline?: Timeline,
    searchbar?: string
}

export interface ResponseBody {
            
}

export interface authPwdOptions{
    username: string,
    password: string,
}

export interface authApiOptions{
    username: string,
    apiKey: string,
}

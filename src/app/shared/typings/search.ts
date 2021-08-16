export interface Timeline {
    start: Date | String,
    end: Date | String,
    archive: boolean,
    departments: [string?]
}

export interface serverSettings {
    url: string,
    options?: {}
}
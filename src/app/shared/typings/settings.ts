export interface Drive {
    id:string
    name: string,
    options?: string,
    active: boolean
}

export interface DriveOptions {

}

export interface Module {
    id: string,
    name: string,
    options?: {},
}

export interface ModuleOptions {
    
}

export interface appSettings {
    appmode: string, 
}

export interface Licence {
    id: string,
    username: string,
    apiKey: string,
    url: string
    appmode:string
}
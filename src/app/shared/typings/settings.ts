export interface UserObj {
    user: string,
    apiKey: string,
}

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
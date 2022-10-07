export interface Country {
    [key: string]: string | number;
    id: number;
    name: string;
    flag: string;
    area: number;
    population: number;
}

export interface Car {
    [key: string]: string | number;
    id: number;
    name: string;
    image_url: string;
    description: string;
    brand_id: number;
}

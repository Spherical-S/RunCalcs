export type eventDetails = {
    display: string,
    doubles: Record<string, string>;
}

export type indoorDoubleMapType = Record<string, eventDetails>;

export const INDOORDOUBLEMAP : indoorDoubleMapType = {
    "200msh": {display: "200m", doubles: {
        "300msh": "300m"
    }},
    "300msh": {display: "300m", doubles: {
        "200msh": "200m",
        "400msh": "400m"
    }},
    "400msh": {display: "400m", doubles: {
        "300msh": "300m",
        "500msh": "500m",
        "600msh": "600m"
    }},
    "500msh": {display: "500m", doubles: {
        "400msh": "400m",
        "600msh": "600m"
    }},
    "600msh": {display: "600m", doubles: {
        "400msh": "400m",
        "500msh": "500m",
        "800msh": "800m"
    }},
    "800msh": {display: "800m", doubles: {
        "600msh": "600m",
        "1000msh": "1000m"
    }},
    "1000msh": {display: "1000m", doubles: {
        "800msh": "800m"
    }},
    "1500msh": {display: "1500m", doubles: {
        "Milesh": "Mile"
    }},
    "Milesh": {display: "Mile", doubles: {
        "1500msh": "1500m"
    }},
    "3000msh": {display: "3000m", doubles: {
        "5000msh": "5000m"
    }},
    "5000msh": {display: "5000m", doubles: {
        "3000msh": "3000m"
    }}
}
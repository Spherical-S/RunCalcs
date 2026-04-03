export default function elevationToGrade(elevation: number, elevationUnit: string, distance: number, distanceUnit: string): number {

    var elevationInMeters: number;
    var distanceInMeters: number;

    if (elevationUnit === "%"){
        return elevation;
    }
    else if (elevationUnit === "yds"){
        elevationInMeters = elevation * 0.9144;
    }
    else if (elevationUnit === "ft"){
        elevationInMeters = elevation * 0.3048;
    } else {
        elevationInMeters = elevation;
    }

    if (distanceUnit === "km"){
        distanceInMeters = distance * 1000;
    } else if (distanceUnit === "mi"){
        distanceInMeters = distance * 1609.34;
    } else if (distanceUnit === "yds"){
        distanceInMeters = distance * 0.9144;
    } else {
        distanceInMeters = distance;
    }

    const horizontalDistance = Math.sqrt(Math.pow(distanceInMeters, 2) - Math.pow(elevationInMeters, 2));

    return (elevationInMeters / horizontalDistance) * 100;
    
}
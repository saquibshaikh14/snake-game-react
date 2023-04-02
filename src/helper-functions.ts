
/**
 * 
 * Matches object value, if field having array,
 *  it will compare length at level 1
 */
const objectEqual = <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {

    if (typeof obj1 !== 'object' || !obj1 || obj1 instanceof Array ||
        typeof obj2 !== 'object' || !obj2 || obj2 instanceof Array) {
        console.warn(obj1, obj2)
        throw new Error('Both arguments must be objects');
    }


    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    //length is not same
    if (keys1.length !== keys2.length) return false;

    //check for keys are matching
    for (const key of keys1) {
        if (!keys2.includes(key))
            return false;
    }

    //check for properties
    for (const key of keys1) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (Array.isArray(value1) && Array.isArray(value2)) {
            if (!arrayLengthEqual(value1, value2))
                return false;
        } else if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
            if (!objectEqual(value1, value2))
                return false;
        } else if (value1 !== value2) {
            return false;
        }
    }

    return true;
}

const arrayLengthEqual = (arr1: any[], arr2: any[]): boolean => {
    if (!Array.isArray(arr1) && !Array.isArray(arr2)) {
        throw Error("Both argument need to be arry");
    }

    return arr1.length === arr2.length ? true : false;
}


export default {
    objectEqual,
    arrayLengthEqual
}



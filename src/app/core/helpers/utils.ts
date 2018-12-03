export function removeFromArray(array, value) {
    var idx = array.indexOf(value);
    if (idx !== -1) {
        array.splice(idx, 1);
    }
    return array;
}

export function removeFromArrayByProperty(array: any[], value: any, propertyName: string) {
    for (var i = array.length - 1; i >= 0; --i) {
        if (array[i][propertyName] == value) {
            array.splice(i,1);
        }
    }
    return array;
}

export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

export function groupByArray(xs, key) { 
    return xs.reduce((rv, x) => { 
        let v = key instanceof Function ? key(x) : x[key];
        let el = rv.find((r) => r && r.key === v);
        if (el) { 
            el.values.push(x); 
        } 
        else { 
            rv.push({ key: v, values: [x] }); 
        } 
        return rv; 
    }, []); 
}
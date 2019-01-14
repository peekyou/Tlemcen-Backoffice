export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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

export function validateDate(event: any) {
    const pattern = /^[0-9/]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }
}

export function filterLookup(value: string, list: any[]): any[] {
    if (typeof value === 'string') {
        const filterValue = value.toLowerCase();
        return list.filter(c => c.name.toLowerCase().indexOf(filterValue) !== -1);
    }
    return [value];
}

export function getHajjOmraCityIdFromName(city): string {
    if (city) {
        return city.toLowerCase().indexOf('mecque') == -1 ? '2' : '1';
    }
    return null;
}

export function isMekka(address): boolean {
    if (address && address.city) {
        return address.city.toLowerCase().indexOf('mecque') !== -1;
    }
    return false;
}
function queryString(queryProperties) {
    let queryString = '';
    for(let property in queryProperties) {
        queryString += `${property}=${queryProperties[property].toString()}&`
    }
    return queryString.slice(0,-1)
}

//http request funtions
  //GET
export async function api_get(url, username, filename){
    let url2 = url + "?username=" + username + "&filename=" + filename;
    let results;
    await fetch(url2)
    .then(response => response.json())  // convert to json
    .then(json => results = json)
    .then(() => console.log(results))//print data to console
    .catch(err => console.log('Request Failed', err)); // Catch errors 
    return results;
}

//POST
export async function api_post(url, data){
  let res;
    await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(json => res = json)
        .then(res => console.log(res));
    return res;
}

//DELETE
export function api_delete(url, data){
    fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(res => console.log(res));
}


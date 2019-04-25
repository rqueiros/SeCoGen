const db = firebase.firestore();
const btnSearch = document.querySelector("#btnSearch")

btnSearch.addEventListener("click", function () {
    const objs = []
    const txtSearch = document.querySelector("#txtSearch").value
    db.collection("apis").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const obj = doc.data()
            if (obj.tags.includes(txtSearch)) {
                objs.push(doc)
                console.log(doc)
            }
        });
        renderApis(objs)
    });
})

/**
 * 
 * @param {Array } objs 
 */
const renderApis = objs => {
    const table = document.querySelector("#tblApis")
    if (objs.length != 0) {
        table.innerHTML = `
        <thead class="thead-dark">
            <tr><th colspan="4">1. Select an API</th></tr>    
            </thead>    
            <tr>                
                <th scope="col">#</th>
                <th scope="col">Description</th>
                <th scope="col">Base URL</th>
                <th scope="col">Actions</th>
            </tr>
        `
        let i = 0
        for (const obj of objs) {
            const idApi = obj.id
            const objApi = obj.data()
            table.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${objApi.description}</td>
                    <td>${objApi.base_url}</td>                
                    <td>
                        <button id='${idApi}' class='btn btn-danger apis'>get endpoints</button>  
                    </td>  
                </tr>
            `
            i++
        }

        const endpoints = document.getElementsByClassName("apis")
        for (const endpoint of endpoints) {
            endpoint.addEventListener("click", function () {
                const docRef = db.collection("apis").doc(this.id)
                docRef.get().then(function (doc) {
                    if (doc.exists) {
                        const apiEndpoints = doc.data().endpoints
                        renderEndpoints(apiEndpoints)
                        for (const apiEndpoint of apiEndpoints) {
                            console.log(apiEndpoint)
                        }
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function (error) {
                    console.log("Error getting document:", error);
                });

            })
        }
    } else {
        table.innerHTML = ""
    }


}

/**
 * 
 * @param {Array } endpoints of a specific API 
 */
const renderEndpoints = endpoints => {
    const table = document.querySelector("#tblEndpoints")
    if (endpoints.length != 0) {
        table.innerHTML = `
        <thead class="thead-dark">
            <tr><th colspan="4">2. Select an Endpoint</th></tr>        
        </thead>
            <tr>                
                <th scope="col">#</th>
                <th scope="col">Description</th>
                <th scope="col">Endpoint</th>
                <th scope="col">Actions</th>
            </tr>
        `
        let i = 0
        for (const endpoint of endpoints) {
            table.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${endpoint.description}</td>
                    <td>${endpoint.endpoint}</td>                
                    <td>
                        <button id='${i+1}' class='btn btn-danger endpoints'>run endpoint</button>  
                    </td>  
                </tr>
            `
            i++
        }
        const btnEndpoints = document.getElementsByClassName("endpoints")
        for (const btnEndpoint of btnEndpoints) {
            btnEndpoint.addEventListener("click", function () {
                const placeholders = endpoints[this.id - 1].placeholders
                let endpoint = endpoints[this.id - 1].endpoint
                if (placeholders.length) {
                    for (const placeholder of placeholders) {
                        const response = prompt(placeholder.name + "?")
                        console.log("Response: " + response)
                        console.log("Id: " + placeholder.id)
                        endpoint = endpoint.replace(placeholder.id, response)
                    }
                    renderLanguages(endpoint)
                }
            })
        }
    } else {
        table.innerHTML = ""
    }


}

/**
 * 
 * @param {Array } endpoints of a specific API 
 */
const renderLanguages = endpoint => {
    const table = document.querySelector("#tblLanguages")
    table.style.visibility = "visible"
    const txtRequestCode = document.querySelector("#txtRequestCode")
    txtRequestCode.value = `
        let response = await fetch('${endpoint}');
        let data = await response.json();
        console.log(data);    
    `

    const btnRun = document.querySelector("#btnRun")
    btnRun.addEventListener("")

}
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
        renderTable(objs)
    });
})

/**
 * 
 * @param {Array } objs 
 */
const renderTable = (objs) => {
    const table = document.querySelector("table")
    if (objs.length != 0) {
        table.innerHTML = `        
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
                        <button id='${idApi}' class='btn btn-danger endpoints'>get endpoints</button>  
                    </td>  
                </tr>
            `
            i++
        }

        const endpoints = document.getElementsByClassName("endpoints")
        for (const endpoint of endpoints) {
            endpoint.addEventListener("click", function () {
                const docRef = db.collection("apis").doc(this.id)
                docRef.get().then(function (doc) {
                    if (doc.exists) {
                        const apiEndpoints = doc.data().endpoints
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
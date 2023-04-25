"use strict"

// fungsi utk memberikan titik setelah 3 angka
function numberWithDot(x) {
    let parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",");
    }

// fungsi utk mengambil data dari API
function dataTerbaru() {
    // menginisialisasi class XHR
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            // console.log(result);
            result = result.features;
            // console.log(result);

            // membuat array kosong utk menampung data
            const myData = [];

            for (let data of result){
                data = data.attributes;                
                myData.push(data);
                // const FID = data.filter(n => n.FID == 1 );                            
            }            

            // mengurutkan data berdasarkan provinsi (a-z)
            myData.sort((a, b) => {
                let provinsiA = a.Provinsi.toUpperCase(); // ignore upper and lowercase
                let provinsiB = b.Provinsi.toUpperCase(); // ignore upper and lowercase

                if (provinsiA < provinsiB){
                    return -1;
                }
                if (provinsiA > provinsiB){
                    return 1;
                }
                return 0;
            })            
            // console.log(myData);

            const cleanData = myData.map((n) => ({
                id : n.Kode_Provi,
                provinsi : n.Provinsi,
                sembuh : n.Kasus_Semb,
                positif : n.Kasus_Posi,
                meninggal : n.Kasus_Meni,
            }));            
            
            // data yang sudah bersih, disrotir dan diurutkan
            console.log(cleanData);            

            let table_covid = document.querySelector('.covid-19');            
            table_covid.querySelector('tbody');

            let total_sembuh = null;
            let total_positif = null;
            let total_meninggal = null;

            for (const data of cleanData){
                const tr = document.createElement('tr');

                tr.innerHTML = `<td>${data.provinsi}</td>`;
                tr.innerHTML += `<td class='text-center fw-bold text-blue'>${data.sembuh}</td>`;
                tr.innerHTML += `<td class='text-center fw-bold text-orange'>${data.positif}</td>`;
                tr.innerHTML += `<td class='text-center fw-bold text-red'>${data.meninggal}</td>`;
                
                total_sembuh += data.sembuh;
                total_positif += data.positif;
                total_meninggal += data.meninggal;
                                
                // memasukkan hasilnya kedalam kedalam table menggunakan method appendChild
                table_covid.querySelector('tbody').appendChild(tr);
            }
            total_sembuh = numberWithDot(total_sembuh);
            total_positif = numberWithDot(total_positif);
            total_meninggal = numberWithDot(total_meninggal);            

            // membuat tag html
            const tr = document.createElement('tr');
            const p_sembuh = document.createElement('p');
            const p_positif = document.createElement('p');
            const p_meninggal = document.createElement('p');

            tr.innerHTML = `<th>Total</th>`;
            tr.innerHTML += `<th class="clr-wht text-center bg-blue">${total_sembuh}</th>`; 
            tr.innerHTML += `<th class="clr-wht text-center bg-orange">${total_positif}</th>`; 
            tr.innerHTML += `<th class="clr-wht text-center bg-red">${total_meninggal}</th>`;
            
            table_covid.querySelector('tbody').appendChild(tr);

            // =========================================================
            const card_sembuh = document.getElementById('sembuh');
            const card_positif = document.getElementById('positif');
            const card_meninggal = document.getElementById('meninggal');

            // memasukkan total kasus kedalam card
            p_sembuh.innerHTML = `<p><b>${total_sembuh}</b> Orang</p>`;
            card_sembuh.appendChild(p_sembuh);

            p_positif.innerHTML = `<p><b>${total_positif}</b> Orang</p>`;
            card_positif.appendChild(p_positif);
    
            p_meninggal.innerHTML = `<p><b>${total_meninggal}</b> Orang</p>`;
            card_meninggal.appendChild(p_meninggal);
            
            console.log(total_sembuh);
        }
    }

    // syntax method open = .open(method, url, async, user, password)
    xhttp.open('GET', 'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json');
    xhttp.send();
}

dataTerbaru();

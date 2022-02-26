import {check_new_material} from './DataChecker.js';
import {metaData, materials_list} from './Simulation.js';

export function config_new_material(){
    document.querySelector("#newmaterialname").hidden = false

    document.querySelector("#newmaterialconductivity").hidden = false
    document.querySelector("#newmaterialdensity").hidden = false
    document.querySelector("#newmaterialheatcapacity").hidden = false

    document.querySelector("#newmaterialbuttons").hidden = false
}

export function hide_config_new_material(){
    document.querySelector("#newmaterialname").hidden = true

    document.querySelector("#newmaterialconductivity").hidden = true
    document.querySelector("#newmaterialdensity").hidden = true
    document.querySelector("#newmaterialheatcapacity").hidden = true

    document.querySelector("#newmaterialbuttons").hidden = true
}

export function save_material_into_db(username, materialname, conductivity, density, heatcapacity) {

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.alert(this.responseText);
        }
    };
    xmlhttp.open("GET","savematerial.php?username=" + username + "&materialname=" + materialname + "&conductivity=" + conductivity + "&density=" + density + "&heatcapacity=" + heatcapacity, true);
    xmlhttp.send();
}

export function save_new_material(){

        //read input data
        let materialname = document.querySelector("#materialname").value;

        let conductivity = document.querySelector("#conductivity").value;
        let density = document.querySelector("#density").value;
        let heatcapacity = document.querySelector("#heatcapacity").value;

        //check input data
        let errors = check_new_material(materialname, conductivity, density, heatcapacity);

        if(errors.length!=0){
            window.alert(errors);
            return;
        }

        hide_config_new_material();
        save_material_into_db(metaData.username, materialname, conductivity, density, heatcapacity);
        get_saved_materials();
}

export function get_saved_materials(){
    //show saved materials
    let xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                materials_list.innerHTML = this.responseText;
            }
          };
    xmlhttp.open("GET","getsavedmaterials.php?username=" + metaData.username, true);
    xmlhttp.send();
}

window.show_material = show_material;

function show_material(name) {

    if (name == "") {
      document.querySelector("#conductivitycond").innerHTML = "0";
      document.querySelector("#densitycond").innerHTML = "0";
      document.querySelector("#heatcapacitycond").innerHTML = "0";
      return;
    } else {
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

          let response_array = this.responseText.split(";");

          document.querySelector("#conductivitycond").innerHTML = response_array[0];
          document.querySelector("#densitycond").innerHTML = response_array[1];
          document.querySelector("#heatcapacitycond").innerHTML = response_array[2];
        }
      };
      xmlhttp.open("GET","material.php?name="+name,true);
      xmlhttp.send();
    }
}
import {metaData, url, prevsimname_list} from './Simulation.js';
import {api_post} from './Controller.js';

export function save_sim_into_db(username, filename) {

    let xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
              window.alert(this.responseText);
          }
      };
    xmlhttp.open("GET","savecalculation.php?username=" + username + "&filename=" + filename, true);
    xmlhttp.send();
}

export function get_saved_files(){
    //show saved files
    let xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                prevsimname_list.innerHTML = this.responseText;
            }
          };
    xmlhttp.open("GET","getsavedfiles.php?username=" + metaData.username,true);
    xmlhttp.send();
}

export async function save_in_database(){

    let data_save_trigger = 
    {
        "username": metaData.username,
    }

    let recieved_data_simsave = await api_post(url, data_save_trigger);
    save_sim_into_db(metaData.username, recieved_data_simsave["data"]["timestamp"]);
    get_saved_files();
}

export function show_savedsims() {

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
//          document.querySelector("#termalcond").innerHTML = this.responseText;
      }
    };
    xmlhttp.open("GET","savedsims.php?username="+metaData.username,true);
    xmlhttp.send();
}
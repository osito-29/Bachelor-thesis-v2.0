import {api_get} from './Controller.js';
import {initData, metaData, url, sim_canvas, sim_ctx} from './Simulation.js';
import {fill_in_input_data} from './FillInputData.js';
import {color_matrix_array} from './ColorMatrix.js';
import {SimulationPlayer} from './SimulationPlayer.js';

var prev_saved_data;
var prev_saved_data_input;

var simulationPlayer;

export var recieved_data;
export var all_sim_data;

export async function get_prev_results(){

    //show loading picture
    document.querySelector("#loadingpic_prevsim").hidden = false;
    getresults.hidden = true;
    
    //show results window

    metaData.username = document.querySelector("#sessionuser").innerHTML;
    metaData.filename = document.querySelector("#prevsimname").value;

    prev_saved_data = await api_get(url, metaData.username, metaData.filename);

    //removes loading picture
    document.querySelector("#loadingpic_prevsim").hidden = true;

    if(prev_saved_data["data"]==null){
        window.alert(metaData.username + " még nem indított korábban számítást!");
        return;
    }

    simresults.hidden = true;
    getresults.hidden = false;

    prev_saved_data_input = prev_saved_data["data"]["inputs"];

    fill_in_input_data(prev_saved_data_input);

    console.log(prev_saved_data_input);

    initData.sheet_width = prev_saved_data_input["width"];
    initData.sheet_height = prev_saved_data_input["height"];
    initData.resolution = prev_saved_data_input["resolution"];

    initData.calctime = prev_saved_data_input["calctime"];

    sim_canvas.setAttribute("width", initData.sheet_width)
    sim_canvas.setAttribute("height", initData.sheet_height)

}

//function to get all calculated data
export async function get_results(){

    //show loading picture
    document.querySelector("#loadingpic").hidden = false;
    
    recieved_data = await api_get(url, metaData.username, metaData.filename)

    var mtx_array = recieved_data["data"]["results"][0]

    all_sim_data = recieved_data["data"]["results"]

    if (recieved_data["data"]["inputs"]["duration"]>=0){
        initData.duration = recieved_data["data"]["inputs"]["duration"];
    } else {
        initData.duration = (Object.keys(all_sim_data).length-1)/10.0;
    }

    //removes loading picture
    document.querySelector("#loadingpic").hidden = true;

    //show results window
    simresults.hidden = false;

    //create SimPlayer instance
    color_matrix_array(mtx_array, sim_ctx)


    //get min-max temperatures of calculated results
    let temperatures = all_sim_data[0];
    let maximumtemp = temperatures[0];
    let minimumtemp = temperatures[0];

    for (let i =0; i<temperatures.length; i++){
        if (temperatures[i]>maximumtemp){
            maximumtemp = temperatures[i];
        }
        if (temperatures[i]<minimumtemp){
            minimumtemp = temperatures[i];
        }
    }

    mintemp.value = minimumtemp;
    maxtemp.value = maximumtemp;

    //visualize results
    simulationPlayer = new SimulationPlayer(all_sim_data);
    simulationPlayer.stop_player();
}
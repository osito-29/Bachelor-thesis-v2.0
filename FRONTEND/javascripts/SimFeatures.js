import {RecordVideo} from './RecordVideo.js';
import {initData, metaData, sim_canvas} from './Simulation.js';
import {recieved_data} from './PrevSimulation.js';

var x_coordinate;
var y_coordinate;

export function export_JSON(json_file) {

    const clicklink_json = document.createElement('div')
    clicklink_json.hidden = true;
    clicklink_json.src = URL.createObjectURL(json_file);
    document.body.appendChild(clicklink_json);
    const a = document.createElement('a');
    a.hidden = true;
    a.download = metaData.username + "_" + metaData.filename + ".json";
    a.href = clicklink_json.src;
    a.textContent = 'download the json file';
    document.body.appendChild(a);
    a.click();

    a.remove();
    clicklink_json.remove();

    //removes loading picture
    document.querySelector("#loadingpic_download").hidden = true;
}


export function download_json(){

    //show loading picture
    document.querySelector("#loadingpic_download").hidden = false;

    let stringify_recieved_data = JSON.stringify(recieved_data, null, 2);

    let sim_file_json = new File([stringify_recieved_data], metaData.username + metaData.filename + "simulationfile.json", {type: "text/json;charset=utf-8"});

    export_JSON(sim_file_json);
  
    console.log("Json downloaded")
}


export async function download_video(){

    //show loading picture
    document.querySelector("#loadingpic_download").hidden = false;

    const recordVideo = new RecordVideo();

    recordVideo.start_canvas_to_record();
    recordVideo.startRecording(initData.duration);
}

export function create_timestamp(){

    let today = new Date();

    let year_raw = today.getFullYear();
    let month_raw = today.getMonth()+1;
    let day_raw = today.getDate();

    let year = (("" + year_raw).length < 2 ? "0" : "") + year_raw;
    let month = (("" + month_raw).length < 2 ? "0" : "") + month_raw;
    let day = (("" + day_raw).length < 2 ? "0" : "") + day_raw;

    let date = year + "" + month + "" + day;

    let hours_raw = today.getHours();
    let minutes_raw = today.getMinutes();
    let seconds_raw = today.getSeconds();

    let hours = (("" + hours_raw).length < 2 ? "0" : "") + hours_raw;
    let minutes = (("" + minutes_raw).length < 2 ? "0" : "") + minutes_raw;
    let seconds = (("" + seconds_raw).length < 2 ? "0" : "") + seconds_raw;

    let time = hours + "" + minutes + "" + seconds;

    let timestamp = date + "-" + time;

    console.log(timestamp)

    return timestamp;
}

//function to define sleep
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//get the position of the mouse clicked on canvas
export function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    x_coordinate = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    y_coordinate = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}

export function show_temperature_of_point(e){
    getCursorPosition(sim_canvas, e);

    //get the value of the current second
    let current_time = document.querySelector("#elapsedtime").value*10.0

    //get data of the current second
    let current_second_data = recieved_data["data"]["results"][current_time];

    //calculate array element according to the coordinates
    let mtx_width = (initData.sheet_width/initData.resolution)

    let numberofelement =Math.floor(y_coordinate/initData.resolution)*mtx_width + Math.floor(x_coordinate/initData.resolution)

    let current_point_temp = current_second_data[numberofelement];

    //round values to be able to show them
    document.querySelector("#picked_x").value = x_coordinate.toFixed(0);
    document.querySelector("#picked_y").value = y_coordinate.toFixed(0);

    document.querySelector("#picked_time").value = document.querySelector("#elapsedtime").value;
    document.querySelector("#picked_temp").value = current_point_temp.toFixed(2);
}
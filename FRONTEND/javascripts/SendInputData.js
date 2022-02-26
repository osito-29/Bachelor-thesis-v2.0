import {read_input_data} from './ReadInputData.js';
import {check_all_input_data} from './DataChecker.js';
import {initData, metaData, url} from './Simulation.js';
import {create_timestamp} from './SimFeatures.js';
import {api_post} from './Controller.js';

//function to send all input data to calculate
export async function send_data(){

    simresults.hidden = true;

    //read all input data
    read_input_data();

    let errors = check_all_input_data();

    if(errors.length!=0){
        window.alert(errors);
        return;
    }

    //show loading picture
    document.querySelector("#loadingpic_sendsim").hidden = false;
    getresults.hidden = true;

    metaData.filename = "latest";

    let timestamp = create_timestamp();

    let data = 
    {
        "timestamp": timestamp,
        "username": metaData.username,
        "width": initData.sheet_width,
        "height": initData.sheet_height,
        "resolution": initData.resolution,
        "starttemp": initData.start_temp,
        "calctype": initData.calctype,

        "conductivity": initData.conductivity,
        "density": initData.density,
        "heatcapacity": initData.heatcapacity,

        "toptemp": initData.toptemp,
        "bottomtemp": initData.bottomtemp,
        "lefttemp": initData.lefttemp,
        "righttemp": initData.righttemp,

        "heatingtemp": initData.heating_temp,
        "heatsource_X": initData.heatsource_X,
        "heatsource_Y": initData.heatsource_Y,
        
        "duration": initData.duration,
        "calctime": initData.calctime,
        "tolerance": initData.tolerance
    }

    console.log(data)
    await api_post(url, data)

    getresults.hidden = false;

    //removes loading picture
    document.querySelector("#loadingpic_sendsim").hidden = true;
}
import {initData, sim_canvas} from './Simulation.js';

//function to read all input data
export function read_input_data(){

    initData.sheet_width = document.querySelector("#sheetwidth").value;
    initData.sheet_height = document.querySelector("#sheetheight").value;
    initData.resolution = document.querySelector("#resolution").value;  

    initData.start_temp = parseFloat(document.querySelector("#starttemp").value)

    if(document.querySelector("#heattransfer_cbox").checked){
        initData.heating_temp = parseFloat(document.querySelector("#heatingtemp").value)
    } else {
        initData.heating_temp = -1;
    }

    initData.heatsource_X = document.querySelector("#heatsource_X").value;
    initData.heatsource_Y = document.querySelector("#heatsource_Y").value

    if(document.querySelector("#toptemp_cbox").checked){ //toptemp előtti doboz bepipálva)
        initData.toptemp = parseFloat(document.querySelector("#toptemp").value);
    } else {
        initData.toptemp = initData.start_temp;
    }

    if(document.querySelector("#bottomtemp_cbox").checked){ //bottomtemp előtti doboz bepipálva)
        initData.bottomtemp = parseFloat(document.querySelector("#bottomtemp").value)
    } else {
        initData.bottomtemp = initData.start_temp;
    }

    if(document.querySelector("#lefttemp_cbox").checked){ //lefttemp előtti doboz bepipálva)
        initData.lefttemp = parseFloat(document.querySelector("#lefttemp").value)
    } else {
        initData.lefttemp = initData.start_temp;
    }

    if(document.querySelector("#righttemp_cbox").checked){ //righttemp előtti doboz bepipálva)
        initData.righttemp = parseFloat(document.querySelector("#righttemp").value)
    } else {
        initData.righttemp = initData.start_temp;
    }

    initData.conductivity = document.querySelector("#conductivitycond").innerHTML;
    initData.density = document.querySelector("#densitycond").innerHTML;
    initData.heatcapacity = document.querySelector("#heatcapacitycond").innerHTML;

    //read the type of calculation
    if(document.querySelector("#limitbytime").checked){
        initData.calctype = "bytime";
        initData.calctime = parseFloat(document.querySelector("#calctime").value);
        initData.duration = initData.calctime;
        initData.tolerance = -1;
    }
    else if (document.querySelector("#limitbytemp").checked){
        initData.calctype = "bytemp";
        initData.calctime = -1;
        initData.duration = -1;
        initData.tolerance = parseFloat(document.querySelector("#tolerance").value);
    }

    sim_canvas.setAttribute("width", initData.sheet_width)
    sim_canvas.setAttribute("height", initData.sheet_height)
}
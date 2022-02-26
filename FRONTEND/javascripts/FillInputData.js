export function fill_in_input_data(input_data){

    document.querySelector("#sheetwidth").value = input_data["width"];
    document.querySelector("#sheetheight").value = input_data["height"];

    document.querySelector("#resolution").value = input_data["resolution"];  
    document.querySelector("#starttemp").value = input_data["starttemp"];

    if(input_data["heatingtemp"] == -1){
        document.querySelector("#heattransfer_cbox").checked = false;
        document.querySelector("#heatingtemp").value = 0;
    } else {
        document.querySelector("#heattransfer_cbox").checked = true;
        document.querySelector("#heatingtemp").value = input_data["heatingtemp"];
    }

    document.querySelector("#heatsource_X").value = input_data["heatsource_X"];
    document.querySelector("#heatsource_Y").value = input_data["heatsource_Y"];

    if(input_data["toptemp"]==input_data["starttemp"]){
        document.querySelector("#toptemp_cbox").checked = false;
        document.querySelector("#toptemp").value = 0;
    } else {
        document.querySelector("#toptemp_cbox").checked = true;
        document.querySelector("#toptemp").value = input_data["toptemp"];        
    }

    if(input_data["bottomtemp"]==input_data["starttemp"]){
        document.querySelector("#bottomtemp_cbox").checked = false;
        document.querySelector("#bottomtemp").value = 0;
    } else {
        document.querySelector("#bottomtemp_cbox").checked = true;
        document.querySelector("#bottomtemp").value = input_data["bottomtemp"];        
    }

    if(input_data["lefttemp"]==input_data["starttemp"]){
        document.querySelector("#lefttemp_cbox").checked = false;
        document.querySelector("#lefttemp").value = 0;
    } else {
        document.querySelector("#lefttemp_cbox").checked = true;
        document.querySelector("#lefttemp").value = input_data["lefttemp"];        
    }

    if(input_data["righttemp"]==input_data["starttemp"]){
        document.querySelector("#righttemp_cbox").checked = false;
        document.querySelector("#righttemp").value = 0;
    } else {
        document.querySelector("#righttemp_cbox").checked = true;
        document.querySelector("#righttemp").value = input_data["righttemp"];        
    }

    document.querySelector("#conductivitycond").innerHTML = input_data["conductivity"];
    document.querySelector("#densitycond").innerHTML = input_data["density"];
    document.querySelector("#heatcapacitycond").innerHTML = input_data["heatcapacity"];

    if(input_data["calctime"]>=0){
        document.querySelector("#limitbytime").checked = true;
        document.querySelector("#calctime").value = input_data["calctime"];

    } else {
        document.querySelector("#limitbytemp").checked = true;
        document.querySelector("#tolerance").value = input_data["tolerance"];    
    }
}
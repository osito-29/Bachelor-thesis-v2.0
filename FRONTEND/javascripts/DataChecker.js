import {initData} from './Simulation.js';

//function to validate new material inputs
export function check_new_material(materialname, conductivity, density, heatcapacity){
    let errors = [];

    if(materialname.length==0){
        errors.push("Nincs megadva anyagnév!\n");
    }
    else if(materialname.length<3){
        errors.push("Anyag megnevezése min. 3 karakter lehet!\n");
    }

    if(conductivity.length==0){
        errors.push("A hővezetési tényező hibás vagy nincs megadva!\n");
    }
    else if (conductivity<=0 || conductivity>1000){
        errors.push("A hővezetési tényező értéke 0-1000 közötti lehet!\n");
    }

    if(density.length==0){
        errors.push("A sűrűség hibás vagy nincs megadva!\n");
    }
    else if (density<=0 || density>25000){
        errors.push("A sűrűség értéke 0-25000 közötti lehet!\n");
    }

    if(heatcapacity.length==0){
        errors.push("A fajhő hibás vagy nincs megadva!\n");
    }
    else if (heatcapacity<=0 || heatcapacity>10){
        errors.push("A fajhő értéke 0-10 közötti lehet!\n");
    }

    return errors;
}

//function to check all input data before sending them to the backend
export function check_all_input_data(){

    let errors = [];

    //check sheet data
    if((initData.conductivity==0) || (initData.density==0) || (initData.heatcapacity==0)){
        errors.push("Nincs alapanyag kiválasztva!\n");
    }
    

    if(!(Number.isInteger(+initData.sheet_width))){
        errors.push("A szélesség csak egész érték lehet!\n");
    }
    else if(!(+initData.sheet_width>=100 && +initData.sheet_width<=500)){
        errors.push("A szélesség 100-500 közötti érték lehet!\n");
    }


    if(!(Number.isInteger(+initData.sheet_height))){
        errors.push("A magasság csak egész érték lehet!\n");
    }
    else if(!(+initData.sheet_height>=100 && +initData.sheet_height<=500)){
        errors.push("A magasság 100-500 közötti érték lehet!\n");
    }

    if(!(+initData.start_temp>=0 && +initData.start_temp<=1000)){
        errors.push("Az alaphőmérséklet 0-1000 közötti érték lehet!\n");
    }


    if(!(Number.isInteger(+initData.resolution))){
        errors.push("A felbontás csak egész érték lehet!\n");
    }   
    else if(!(+initData.resolution>=5 && +initData.resolution<=20)){
        errors.push("A felbontás 5-20 közötti érték lehet!\n");
    }

    //check ratio
    if(!(Number.isInteger(+initData.sheet_width/+initData.resolution) && Number.isInteger(+initData.sheet_height/+initData.resolution))){
        errors.push("A magasság/felbontás és a szélesség/felbontás csak egészek lehetnek\n");
    }    


    //check simulation conditions
    if(document.querySelector("#heattransfer_cbox").checked){ //checkbox ticked to add heat transfer point

        if(!(Number.isInteger(+initData.heatsource_X))){
            errors.push("Az X koordináta csak egész érték lehet!\n");
        }
        else if(!(parseFloat(initData.heatsource_X)>=0 && +initData.heatsource_X<=+initData.sheet_width)){
            errors.push("Az X koordináta 0-lemezszélesség közötti érték lehet!\n");
        }


        if(!(Number.isInteger(+initData.heatsource_Y))){
            errors.push("Az Y koordináta csak egész érték lehet!\n");
        }
        else if(!(parseFloat(initData.heatsource_Y)>=0 && +initData.heatsource_Y<=+initData.sheet_height)){
            errors.push("Az Y koordináta 0-lemezmagasság közötti érték lehet!\n");
        }
              
        if(!(+initData.heating_temp>=0 && +initData.heating_temp<=1000)){
            errors.push("Az hőközlés 0-1000 közötti érték lehet!\n");
        }
    }



    //check top edge
    if(document.querySelector("#toptemp_cbox").checked){ //checkbox ticked
   
        if(!(+initData.toptemp>=0 && +initData.toptemp<=1000)){
            errors.push("A felső él 0-1000 fok közötti érték lehet!\n");
        }
    }

    //check left edge
    if(document.querySelector("#lefttemp_cbox").checked){ //checkbox ticked
   
        if(!(+initData.lefttemp>=0 && +initData.lefttemp<=1000)){
            errors.push("A balos él 0-1000 fok közötti érték lehet!\n");
        }
    }

    //check right edge
    if(document.querySelector("#righttemp_cbox").checked){ //checkbox ticked
   
        if(!(+initData.righttemp>=0 && +initData.righttemp<=1000)){
            errors.push("A jobbos él 0-1000 fok közötti érték lehet!\n");
        }
    }

    //check bottom edge
    if(document.querySelector("#bottomtemp_cbox").checked){ //checkbox ticked
   
        if(!(+initData.bottomtemp>=0 && +initData.bottomtemp<=1000)){
            errors.push("Az alsó él 0-1000 fok közötti érték lehet!\n");
        }
    }


    //validate the two calculation options
    if(document.querySelector("#limitbytime").checked){ //checkbox ticked
   
        if(!(+initData.calctime>=1 && +initData.calctime<=100)){
            errors.push("Az időtartam 1-100 sec közötti érték lehet!\n");
        }
    }

    if(document.querySelector("#limitbytemp").checked){ //checkbox ticked
   
        if(!(+initData.tolerance>0 && +initData.tolerance<=10)){
            errors.push("A toleranciaszint 0.01-10 fok közötti érték lehet!\n");
        }
    }

    return errors;
}
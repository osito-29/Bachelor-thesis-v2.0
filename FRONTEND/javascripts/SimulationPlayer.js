import {initData, elapsedtime_label, sim_ctx} from './Simulation.js';
import {sleep} from './SimFeatures.js';
import {color_matrix_array} from './ColorMatrix.js';
import {all_sim_data} from './PrevSimulation.js';

var isplaying = false;
var seconds_counter = 0;

export class SimulationPlayer{

    //define buttons of the simulation player with click events
    fast_backward_btn = document.querySelector("#fastbackwardbtn").addEventListener('click', this.fast_backward);
    step_backward_btn = document.querySelector("#stepbackwardbtn").addEventListener('click', this.step_backward);
    stop_btn = document.querySelector("#stopbtn").addEventListener('click', this.stop_player);
    play_btn = document.querySelector("#playbtn").addEventListener('click', this.play);
    pause_btn = document.querySelector("#pausebtn").addEventListener('click', this.pause);
    step_forward_btn = document.querySelector("#stepforwardbtn").addEventListener('click', this.step_forward);
    fast_forward_btn = document.querySelector("#fastforwardbtn").addEventListener('click', this.fast_forward);

    elapsedtimerange_attr = document.querySelector("#elapsedtimerange").setAttribute("max", initData.duration*10);
    elapsedtimerange_event_list = document.querySelector("#elapsedtimerange").addEventListener('change', this.change_range);
    elapsedtimerange = document.querySelector("#elapsedtimerange");

    //define functions of clicked buttons
    fast_backward(){
        seconds_counter = 0;
        elapsedtime_label.value = 0;
        elapsedtimerange.value = 0;
        color_matrix_array(all_sim_data[0], sim_ctx);
    }
    
    step_backward(){
        if(seconds_counter>0){
            seconds_counter -= 1;
            elapsedtime_label.value = seconds_counter/10.0;
            elapsedtimerange.value = seconds_counter;
            color_matrix_array(all_sim_data[seconds_counter], sim_ctx);
        }
    }
    
    stop_player(){
        isplaying = false;
        seconds_counter = 0;
        elapsedtime_label.value = 0;
        elapsedtimerange.value = 0;
        color_matrix_array(all_sim_data[0], sim_ctx);
    }
    
    async play(){
        if(!isplaying){
            isplaying = true;
            while (isplaying && seconds_counter<initData.duration*10){
                await sleep(100);
                if(isplaying){
                    seconds_counter +=1;
                    elapsedtime_label.value = seconds_counter/10.0;
                    elapsedtimerange.value = seconds_counter;
                    color_matrix_array(all_sim_data[seconds_counter], sim_ctx)
                }
            }
            isplaying = false;
        }
    }
    
    pause(){
        isplaying = false;
    }
    
    step_forward(){
        if(seconds_counter<initData.duration*10){
            seconds_counter += 1;
            elapsedtime_label.value = seconds_counter/10.0;
            elapsedtimerange.value = seconds_counter;
            color_matrix_array(all_sim_data[seconds_counter], sim_ctx);
        }
    }
    
    fast_forward(){
        isplaying = false;
        seconds_counter = initData.duration*10;
        elapsedtime_label.value = seconds_counter/10.0;
        elapsedtimerange.value = seconds_counter;
        color_matrix_array(all_sim_data[seconds_counter], sim_ctx);
    }

    change_range(){
        isplaying = false;
        seconds_counter = parseInt(elapsedtimerange.value);
        elapsedtime_label.value = seconds_counter/10;
        color_matrix_array(all_sim_data[seconds_counter], sim_ctx);
    }

}
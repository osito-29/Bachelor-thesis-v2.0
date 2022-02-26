import {download_json, download_video, show_temperature_of_point} from './SimFeatures.js';
import {send_data} from './SendInputData.js';
import {config_new_material, hide_config_new_material, save_new_material} from './MaterialFunctions.js';
import {show_savedsims, save_in_database} from './SaveSimulation.js';
import {get_results, get_prev_results} from './PrevSimulation.js';
import {MetaData} from './MetaData.js';
import {InitData} from './InitData.js';

//create canvas for simulation
export const sim_canvas = document.getElementById("simcanvas");
export const sim_ctx = sim_canvas.getContext("2d");

//create canvas for recording results
export const video_canvas = document.querySelector("#video_canvas");
export const video_ctx = video_canvas.getContext("2d");

//define mouseclick to show temperature of canvas
sim_canvas.addEventListener('mousedown', show_temperature_of_point);

//reveal section to add new material to the database
const config_new_material_btn = document.querySelector("#confignewmaterialbtn");
const save_new_material_btn = document.querySelector("#savenewmaterialbtn");
const cancel_new_material_btn = document.querySelector("#cancelnewmaterialbtn");

//reading input data for simulation
const simresults = document.querySelector("#simresults");
const getresults = document.querySelector("#getresults");
const run_simulation_btn = document.querySelector("#startsimbtn");
const send_data_btn = document.querySelector("#senddatabtn");
const get_results_btn = document.querySelector("#getresultsbtn");

//elements to show simulation results

const indicator_pic = document.querySelector("#indicator");
const mintemp = document.querySelector("#mintemp");
const maxtemp = document.querySelector("#maxtemp");

//elements to show materials

export const materials_list = document.querySelector("#materialslist");

//elements to select previous simulation
const getprevsim_btn = document.querySelector("#getprevsimbtn");
export const prevsimname_list = document.querySelector("#prevsimname");

prevsimname_list.addEventListener('onchange', show_savedsims)

//run_simulation_btn.addEventListener('click', run_simulation);
config_new_material_btn.addEventListener('click', config_new_material);
save_new_material_btn.addEventListener('click', save_new_material);
cancel_new_material_btn.addEventListener('click', hide_config_new_material);

//get the user of the session
//const sessionuser = document.querySelector("#sessionuser");

send_data_btn.addEventListener('click', send_data);
get_results_btn.addEventListener('click', get_results);
getprevsim_btn.addEventListener('click', get_prev_results);

//save and download results - interfaces
//save to database saves results on the backend server + into the database
const save_in_database_btn = document.querySelector("#saveindatabasebtn");
save_in_database_btn.addEventListener('click', save_in_database);

const download_json_btn = document.querySelector("#downloadjsonbtn");
download_json_btn.addEventListener('click', download_json);

const download_video_btn = document.querySelector("#downloadvideobtn");
download_video_btn.addEventListener('click', download_video);

//const url = "http://127.0.0.1:5000/calculation"
export const url = "http://91.227.139.170:5000/calculation";

//result connected elements
export const elapsedtime_label = document.querySelector("#elapsedtime");

//initialize data objects
export var metaData = new MetaData();
export var initData = new InitData();

metaData.username = document.querySelector("#sessionuser").innerHTML;
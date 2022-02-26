import {initData} from './Simulation.js';

export function color_matrix_array(mtx_array, canvas_ctx){

    let color_scale = 255/(maxtemp.value-mintemp.value);

    let mtx_height = (initData.sheet_height/initData.resolution)
    let mtx_width = (initData.sheet_width/initData.resolution)

    for (let k =0; k<mtx_array.length; k++){
        let i = Math.floor(k/mtx_width)
        let j = k%mtx_width

        canvas_ctx.fillStyle = `rgb(${(mtx_array[k]-mintemp.value)*color_scale}, ${255-2*Math.abs(128-((mtx_array[k]-mintemp.value)*color_scale))}, ${255-((mtx_array[k]-mintemp.value)*color_scale)})`;
        canvas_ctx.fillRect(j*initData.resolution, i*initData.resolution, initData.resolution, initData.resolution);
    }
}
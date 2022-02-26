import {initData, metaData, video_ctx} from './Simulation.js';
import {sleep} from './SimFeatures.js';
import {color_matrix_array} from './ColorMatrix.js';
import {all_sim_data} from './PrevSimulation.js';

export class RecordVideo{

    async start_canvas_to_record(){

        video_canvas.setAttribute("width", initData.sheet_width);
        video_canvas.setAttribute("height", initData.sheet_height);
    
        let recording_time_counter = 0;
        color_matrix_array(all_sim_data[recording_time_counter], video_ctx);
    
        while (recording_time_counter<initData.duration*10){
            await sleep(100);
                recording_time_counter++;
                color_matrix_array(all_sim_data[recording_time_counter], video_ctx);
        }
    }
    
    startRecording(duration) {
    
      const chunks = []; // here we will store our recorded media chunks (Blobs)
      const stream = video_canvas.captureStream(); // grab our canvas MediaStream
      const rec = new MediaRecorder(stream); // init the recorder
      // every time the recorder has new data, we will store it in our array
      rec.ondataavailable = e => chunks.push(e.data);
      // only when the recorder stops, we construct a complete Blob from all the chunks
      rec.onstop = e => this.export_video(new Blob(chunks, {type: 'video/webm'}));
      
      rec.start();
      setTimeout(()=>rec.stop(), duration*1000); // stop recording in X s
    
    }
    
    export_video(video_file) {
    
        const clicklink_video = document.createElement('div');
        clicklink_video.hidden = true;
        clicklink_video.src = URL.createObjectURL(video_file);
        document.body.appendChild(clicklink_video);
        const b = document.createElement('a');
        b.hidden = true;
        b.download = metaData.username + "_" + metaData.filename + ".webm";
        b.href = clicklink_video.src;
        b.textContent = 'download the video';
        document.body.appendChild(b);
        b.click();
    
        clicklink_video.remove();
        b.remove();
    
        //removes loading picture
        document.querySelector("#loadingpic_download").hidden = true;
        console.log("video downloaded");
    }
}

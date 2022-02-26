from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import subprocess
import json
import os

app = Flask(__name__)
api = Api(app)
CORS(app)

class Calculations(Resource):
    def get(self):
        self.username = request.args['username']
        self.filename = request.args['filename']
        if (os.path.isfile("./simulations/outputs/" + self.username + "_" + self.filename + ".json")):

            with open("./simulations/outputs/" + self.username + "_" + self.filename + ".json", "r") as resultfile:
                data = json.load(resultfile)
                resultfile.close()
            return {'data' : data}, 200

        else:
            return {'data' : None}, 200
 
    def post(self):

        parser = reqparse.RequestParser()
        parser.add_argument('timestamp', required=False)
        parser.add_argument('username', required=True)
        args = parser.parse_args()

        if args['timestamp'] is None:

            filesave_process = "/root/simulation/sim_environment/bin/python save_results.py " + args['username']
            time = subprocess.check_output(filesave_process, shell=True).decode("utf-8").split("\n")[0]

            saved_data ={
                "timestamp"     : time,
                "username"      : args['username']
            }

            return {'data' : saved_data}, 201

        else:

            parser = reqparse.RequestParser()
            parser.add_argument('timestamp', required=False)
            parser.add_argument('username', required=True)
            parser.add_argument('width', required=False)
            parser.add_argument('height', required=False)
            parser.add_argument('resolution', required=False)
            parser.add_argument('starttemp', required=False)
            parser.add_argument('calctype', required=False)

            parser.add_argument('conductivity', required=False)
            parser.add_argument('density', required=False)
            parser.add_argument('heatcapacity', required=False)

            parser.add_argument('toptemp', required=False)
            parser.add_argument('bottomtemp', required=False)
            parser.add_argument('lefttemp', required=False)
            parser.add_argument('righttemp', required=False)

            parser.add_argument('heatingtemp', required=False)
            parser.add_argument('heatsource_X', required=False)
            parser.add_argument('heatsource_Y', required=False)
            parser.add_argument('duration', required=False)
            parser.add_argument('calctime', required=False)            
            parser.add_argument('tolerance', required=False)
            args = parser.parse_args()

            input_data ={
                "timestamp"     : args['timestamp'],
                "username"      : args['username'],
                "width"         : args['width'],
                "height"        : args['height'],
                "resolution"    : args['resolution'],
                "starttemp"     : args['starttemp'],
                "calctype"      : args['calctype'],

                "conductivity"  : args['conductivity'],
                "density"       : args['density'],
                "heatcapacity"  : args['heatcapacity'],

                "toptemp"       : args['toptemp'],
                "bottomtemp"    : args['bottomtemp'],
                "lefttemp"      : args['lefttemp'],
                "righttemp"     : args['righttemp'],
                
                "heatingtemp"   : args['heatingtemp'],
                "heatsource_X"  : args['heatsource_X'],
                "heatsource_Y"  : args['heatsource_Y'],
                "duration"      : args['duration'],
                "calctime"      : args['calctime'],
                "tolerance"     : args['tolerance']
            }

            # Serializing json 
            json_object = json.dumps(input_data, indent = 4) 
        
            # Writing to inputfile.json
            with open("./simulations/inputs/"+ args['username'] + "_input_latest.json", "w") as outfile:
                outfile.write(json_object)
        
            #calculation starts
            process = "/root/simulation/sim_environment/bin/python mtx_calc.py " + args['username']
            subprocess.call(process, shell=True)

            return {'data' : input_data}, 201

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True)
        args = parser.parse_args()

        if (os.path.isfile("./simulations/outputs/" + args['username'] + "_latest.json")):
            for file in os.listdir("./simulations/outputs/"):
                if file.startswith(args['username'] + "_"):
                    os.remove("./simulations/outputs/"+ file) 

        if (os.path.isfile("./simulations/inputs/" + args['username'] + "_input_latest.json")):
            for file in os.listdir("./simulations/inputs/"):
                if file.startswith(args['username'] + "_"):
                    os.remove("./simulations/inputs/"+ file)          

        return {'message' : 'Records deleted successfully.'}, 200

# Add URL endpoints
api.add_resource(Calculations, '/calculation')

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
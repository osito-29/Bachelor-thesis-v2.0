import sys
import json
import numpy as np
import math
from decimal import *

class Simulation():

    #read input data
    def read_input_data(self):
        self.username = sys.argv[1]
        with open("./simulations/inputs/" + self.username +"_input_latest.json", "r") as inputfile:
            self.input_data = json.load(inputfile)
            inputfile.close()

        #all input data to use for calculation
        self.username = self.input_data["username"]
        self.width = int(self.input_data["width"])
        self.height = int(self.input_data["height"])
        self.resolution = int(self.input_data["resolution"])
        self.starttemp = float(self.input_data["starttemp"])
        self.calctype = self.input_data["calctype"]

        self.conductivity = float(self.input_data["conductivity"])
        self.density = int(self.input_data["density"])
        self.heatcapacity = float(self.input_data["heatcapacity"])

        self.toptemp = float(self.input_data["toptemp"])
        self.bottomtemp = float(self.input_data["bottomtemp"])
        self.lefttemp = float(self.input_data["lefttemp"])
        self.righttemp = float(self.input_data["righttemp"])

        self.heatingtemp = float(self.input_data["heatingtemp"])
        self.heatsource_X = int(self.input_data["heatsource_X"])
        self.heatsource_Y = int(self.input_data["heatsource_Y"])
        self.duration = int(self.input_data["duration"])
        self.calctime = int(self.input_data["calctime"])
        self.tolerance = float(self.input_data["tolerance"])
        
    def set_init_matrix(self):
        self.mtx_width = int(self.width/self.resolution)
        self.mtx_height = int(self.height/self.resolution)
        self.matrix = np.full((self.mtx_height, self.mtx_width), self.starttemp)

        # Set Boundary condition
        self.matrix[(self.mtx_height-1):, :] = self.bottomtemp
        self.matrix[:1, :] = self.toptemp
        self.matrix[:, (self.mtx_width-1):] = self.righttemp
        self.matrix[:, :1] = self.lefttemp

        # Set heat transfer point
        if(self.heatingtemp>=0):
            self.matrix[int(self.heatsource_X/self.resolution)][int(self.heatsource_Y/self.resolution)] = self.heatingtemp

    def set_calculation_parameters(self):

        #data of steel
#        self.conductivity = 50      #hővezetési tényező (lambda)
#        self.density = 7850         #sűrűség (ró)
#        self.heat_capacity = 0.465  #fajhő (c)

        #parameters for calculation
        self.dt = 0.1
#        self.alpha = 1.6563e-4
        self.alpha = self.conductivity/(self.density*self.heatcapacity*1000) #SI!

        self.K1 = self.alpha*self.dt*(math.pow((1000/self.resolution),2)) #SI!
        self.K2 = self.alpha*self.dt*(math.pow((1000/self.resolution),2)) #SI!

        #scale parameter to keep calculation stable
        self.scale = 1

        #adjust scale parameter to reduce delta time => calculation remains stable
        while((self.K1/self.scale)>0.2 or (self.K2/self.scale)>0.2):
            self.scale = self.scale*2

        self.K1 = self.K1/self.scale
        self.K2 = self.K2/self.scale

    #calculation
    def calculate_matrix(self):

        temp_matrix = np.copy(self.matrix)    
        for i in range(1, self.mtx_height-1):
            for j in range(1, self.mtx_width-1):
            
                term1 = temp_matrix[i][j]*(1-2*self.K1-2*self.K2)
                term2 = self.K1*(temp_matrix[i-1][j]+temp_matrix[i+1][j])
                term3 = self.K2*(temp_matrix[i][j-1]+temp_matrix[i][j+1])

                self.matrix[i][j] = Decimal(term1)+Decimal(term2)+Decimal(term3)
        
        if(self.heatingtemp>=0):
            self.matrix[int(self.heatsource_X/self.resolution)][int(self.heatsource_Y/self.resolution)] = self.heatingtemp

        return self.matrix.flatten()

    def calculate_simulation_data(self):
        results ={

        }

        results[0] = self.matrix[:].flatten()

        if (self.calctype == "bytime"):

            results[0] = results[0].tolist()

            for i in range(int(self.duration/self.dt)*self.scale):

                temp_calc_mtx = self.calculate_matrix()[:]

                if((i+1)%self.scale==0):
                    results[int((i+1)/self.scale)] = temp_calc_mtx.tolist()


        elif (self.calctype == "bytemp"):

            i = 0
            calculate = True

            temp1 = results[0]
            results[0] = results[0].tolist()

            while(calculate and i<1000*self.scale):

                i +=1

                temp_calc_mtx = self.calculate_matrix()[:]

                if(i%self.scale ==0):
                    results[int(i/self.scale)] = temp_calc_mtx
                    temp2 = results[int(i/self.scale)]
                    results[int(i/self.scale)] = results[int(i/self.scale)].tolist()

                    if(np.amax(np.subtract(temp2, temp1))<self.tolerance):
                        calculate = False

                    temp1 = temp2

        return results      

    def write_output_data(self):

        self.results = {
            "inputs":{

            },
            "results":{

            }
        }
        self.results["inputs"] = self.input_data
        self.results["results"] = self.calculate_simulation_data()
        # Serializing json 
        json_object = json.dumps(self.results, indent = 4) 
        # Writing to calculation.json
        with open("./simulations/outputs/" + self.username + "_latest.json", "w") as outfile:
            outfile.write(json_object)
            
    def run(self):
        self.read_input_data()
        self.set_init_matrix()
        self.set_calculation_parameters()
        self.write_output_data()        
      
if __name__ == '__main__':
    getcontext().prec = 6
    sim = Simulation()
    sim.run()
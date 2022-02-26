import sys
import os.path
import unittest
import mtx_calc
import numpy as np


class add_username_arg(object):

    def __init__(self, user):
        self.username = user

    def __enter__(self):
        sys.argv.append(self.username)

    def __exit__(self, typ, value, traceback):
       sys.argv = [arg for arg in sys.argv if arg != self.username]

class TestCalc(unittest.TestCase):

# test if all data is read from testuser input file
    def test_read_input_data(self):
        with add_username_arg("testusername"):
            sim.read_input_data()

        #test cases    
        self.assertEqual(sim.username,"testusername")
        self.assertEqual(sim.width, 100)
        self.assertEqual(sim.height, 90)
        self.assertEqual(sim.resolution,10)
        self.assertEqual(sim.starttemp,25)
        self.assertEqual(sim.calctype, "bytime")

        self.assertEqual(sim.conductivity,100)
        self.assertEqual(sim.density,10000)
        self.assertEqual(sim.heatcapacity, 0.1)

        self.assertEqual(sim.toptemp,20)
        self.assertEqual(sim.bottomtemp,200)
        self.assertEqual(sim.lefttemp,20)
        self.assertEqual(sim.righttemp,200)

        self.assertEqual(sim.heatingtemp, 100)
        self.assertEqual(sim.heatsource_X, 20)
        self.assertEqual(sim.heatsource_Y, 30)
        self.assertEqual(sim.duration, 15)
        self.assertEqual(sim.calctime, 15)
        self.assertEqual(sim.tolerance, 0.1)

    def test_set_init_matrix(self):
        #initial data
        sim.set_init_matrix()

        #test cases
        self.assertEqual(sim.mtx_width, 10) #matrix width
        self.assertEqual(sim.mtx_height, 9) #matrix height

        self.assertEqual(sim.matrix[5][5],25) #centerpoint temp

        self.assertEqual(sim.matrix[0][5],20) #top side temp
        self.assertEqual(sim.matrix[8][5],200) #bottom side temp
        self.assertEqual(sim.matrix[5][0],20) #left side temp
        self.assertEqual(sim.matrix[5][9],200) #right side temp

        self.assertEqual(sim.matrix[2][3],100) #heat_transfer_point temp

    
    def test_set_calculation_parameters(self):
        #initial parameters
        sim.set_calculation_parameters()

        #test cases
        self.assertTrue(sim.K1<0.2)
        self.assertTrue(sim.K2<0.2)

        self.assertTrue(sim.K1*sim.scale>=0.2 or sim.K2*sim.scale>=0.2 or sim.scale==1)

        self.assertTrue(sim.dt<=0.1)

    def test_calculate_matrix(self):

        with add_username_arg("testusername"):
            sim.read_input_data()
        sim.set_init_matrix()
        sim.set_calculation_parameters()

        matrix1 = np.copy(sim.matrix)

        sim.calculate_matrix()
        matrix2 = sim.matrix

        #proof that is is heating
        self.assertTrue(np.average(np.subtract(matrix2, matrix1)) > 0)
    
    def test_calculate_simulation_data(self):

        with add_username_arg("testusername"):
            sim.read_input_data()
        sim.set_init_matrix()
        sim.set_calculation_parameters()

        #bytime
        results_time = sim.calculate_simulation_data()

        #testresults
        self.assertEqual(len(results_time),10*sim.duration+1)

        with add_username_arg("testusername"):
            sim.read_input_data()
        sim.set_init_matrix()
        sim.set_calculation_parameters()

        #bytemp
        sim.calctype = "bytemp"
        results_temp = sim.calculate_simulation_data()

        resultlength = len(results_temp) 
        #testresults
        self.assertTrue(np.amax(np.subtract(results_temp[resultlength-1], results_temp[resultlength-2])) < 0.1)

    def test_write_output_data(self):

        with add_username_arg("testusername"):
            sim.read_input_data()
        sim.set_init_matrix()
        sim.set_calculation_parameters()

        sim.write_output_data()

        self.assertTrue(os.path.isfile("./simulations/outputs/testusername_latest.json"))

        if (os.path.isfile("./simulations/outputs/testusername_latest.json")):
            os.remove("./simulations/outputs/testusername_latest.json")



if __name__ == '__main__':
    sim = mtx_calc.Simulation()
    unittest.main()
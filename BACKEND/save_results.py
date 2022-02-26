import sys
import json

class SaveResults():

    def read_and_save_input_data(self):
        self.username = sys.argv[1]
        with open("./simulations/outputs/" + self.username + "_latest.json", "r") as inputfile:
            self.input_data = json.load(inputfile)
            self.timestamp = self.input_data["inputs"]["timestamp"]
            with open("./simulations/outputs/" + self.username + "_" + self.timestamp + ".json", "w") as outputfile:
                results_to_save = json.dumps(self.input_data, indent = 4) 
                outputfile.write(results_to_save)
                outputfile.close()
            inputfile.close()

    def save_file(self):
        print(self.timestamp)
        return self.timestamp

    def run(self):
        self.read_and_save_input_data()
        self.save_file()     
      
if __name__ == '__main__':
    saveresults = SaveResults()
    saveresults.run()
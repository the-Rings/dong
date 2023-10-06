from flask import Flask, request
import csv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def write_to_file():
    data = request.json.get('data')
    time = request.json.get('time')

    filename = "D:\\dong\\csvs\\" + time + ".csv"
    
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        for d in data:
            writer.writerow([d])
    
    return 'Data written to file successfully!'

if __name__ == '__main__':
    app.run()

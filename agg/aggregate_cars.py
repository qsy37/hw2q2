import json, utils
import sqlite3 as lite
from json_decoder import _decode_dict

js = open('data/cars.json')
data = json.load(js, object_hook=_decode_dict)

cars = []
for item in data:
	entry = {}
	for key, value in item.iteritems():
		entry[key] = utils.convert_type(value)
	entry['manufacturer'] = entry['name'].split(' ')[0]
	cars.append(entry)

car_list = []
for item in cars:
	car_list.append( (item['manufacturer'],
					item['name'],
					item['awd'],
					item['rwd'],
					item['sports'],
					item['minivan'],
					item['wagon'],
					item['pickup'],
					item['suv'],
					item['num_cylinders'],
					item['engine_size'],
					item['horsepower'],
					item['invoice'],
					item['msrp'],
					item['weight'],
					item['length'],
					item['width'],
					item['wheel_base'],
					item['cmpg'],
					item['hmpg']) )
	
con = lite.connect('cars.db')
with con:
	cur = con.cursor()
	cur.execute("DROP TABLE IF EXISTS cars")
	cur.execute("CREATE TABLE cars(manufacturer text, name text, awd integer, rwd integer, sports integer, minivan integer, wagon integer, pickup integer, suv integer, num_cylinders integer, engine_size real, horsepower integer, invoice integer, msrp integer, weight integer, length integer, width integer, wheel_base integer, cmpg integer, hmpg integer)")
	cur.executemany("INSERT INTO cars VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", car_list)
	
con.commit()
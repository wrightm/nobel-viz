import json
import urllib2
import optparse

from pprint import pprint


def read_json(jsonFileName):

	json_data = open(jsonFileName)
	data = json.load(json_data)
	json_data.close()

	return data

def get_geolocation_of_location(location):

	try:
		geo_location_url = "http://nominatim.openstreetmap.org/search?q="+location+"&format=json&limit=1"
		geo_location_info = json.loads(urllib2.urlopen(geo_location_url).read())
		if len(geo_location_info) == 1:
			return geo_location_info[0]["lat"],geo_location_info[0]["lon"]
		else:
			return "NaN","NaN"
	except ValueError:
		return "NaN","NaN"

def make_laureates_outputfile(input_filename, output_filename, verbose, country_filter):

	json_data = read_json(input_filename)
	
	n_laureates = []
	for laureate in json_data["laureates"]:
		if "bornCity" in laureate and "bornCountry" in laureate:
			if country_filter !=  "none":
				country = laureate["bornCountry"].split(',')[0]
                                countrylat, countrylon = get_geolocation_of_location(country)
                                if countrylat == "NaN" or countrylon == "NaN":
                                        continue
				if country.upper() == country_filter.upper():
					city = laureate["bornCity"].split(',')[0]
					citylat, citylon = get_geolocation_of_location(city)
					if citylat == "NaN" or citylon == "NaN":
						continue
                                        n_laureates.append({"born": laureate["born"],"bornCountryCode": laureate["bornCountryCode"],"bornCity": city,"gender": laureate["gender"],"bornCityLatLon": [citylat,citylon],"bornCountryLatLon": [countrylat,countrylon], "prize" : laureate["prizes"][0]["category"], "numberOfPrizes" : len(laureate["prizes"])})
                        else:
                                country = laureate["bornCountry"].split(',')[0]
                                countrylat, countrylon = get_geolocation_of_location(country)
                                if countrylat == "NaN" or countrylon == "NaN":
                                        continue
                                city = laureate["bornCity"].split(',')[0]
                                citylat, citylon = get_geolocation_of_location(city)
                                
                                if citylat == "NaN" or citylon == "NaN":
                                        continue
                                n_laureates.append({"born": laureate["born"],"bornCountryCode": laureate["bornCountryCode"],"bornCity": city,"gender": laureate["gender"],"bornCityLatLon": [citylat,citylon], "bornCountryLatLon": [countrylat,countrylon], "prize" : laureate["prizes"][0]["category"], "numberOfPrizes" : len(laureate["prizes"])})
                         

	with open(output_filename, 'w') as outfile:
		json.dump(n_laureates, outfile)

def main():


	parser = optparse.OptionParser()
	parser.add_option('-o', '--output', 
    	              dest="output_filename", 
        	          default="default.out",
            	      )
	parser.add_option('-i', '--input', 
    	              dest="input_filename", 
        	          default="input.json",
            	      )
	parser.add_option('-v', '--verbose',
    	              dest="verbose",
        	          default=False,
            	      action="store_true",
                	  )
	parser.add_option('--version',
    	              dest="version",
        	          default=1.0,
            	      type="float",
                	  )
	parser.add_option('--dvtype','--data-vis-type',
    	              dest="dvtype",
        	          default="laureates")
	parser.add_option('--cfltr', '--country-filter', 
    	              dest="country_filter", 
        	          default="none",
            	      )

	options, remainder = parser.parse_args()

	input_filename = options.input_filename
	output_filename = options.output_filename
	verbose = options.verbose
	country_filter = options.country_filter
	
	if options.dvtype == "laureates":
		make_laureates_outputfile(input_filename, output_filename, verbose, country_filter)
	else:
		pprint('No valid data-vis-type provides')

if __name__ == "__main__":
	main()

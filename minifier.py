################################################
# Minifer to minify css and java file under    #
# /static/js/ and direct them to /static/lib/  #
################################################

from jsmin import jsmin

from time import gmtime, strftime
import os
import requests

print("Start minifing JavaScript...\n")

homepath = "static/js/"

dirs = os.listdir(homepath)
# Remove lib directory
dirs.remove("lib")

for dir in dirs:
	# Find the files
	path = os.path.join(homepath, dir)
	files = os.listdir(path)

	# Get current version number
	input = open(file = os.path.join(path, "version.js"), encoding = "utf-8")
	content = input.read();
	version = content[content.find("=") + 3:content.find(";") - 1]
	time = strftime("%m%d%y.%H%M%S", gmtime())
	header = "/*" + version + " Minified " + time + "*/\n"

	# Open each file
	for file in files:
		# Read the input from the file
		input = open(file = os.path.join(path, file), encoding="utf-8")
		content = jsmin(input.read()).replace("\n", "")

		# Add a header
		content = header + content

		# Open the output file
		output = open(file = os.path.join(homepath, "lib", file.replace(".js", ".min.js")), mode = "w+", encoding = "utf-8")
		output.write(content)

		# Close both streams
		input.close()
		output.close()

		# Output to console
		print("Minified " + path + "/" + file)

print("\n\nDone minifying")

os.system("pause")
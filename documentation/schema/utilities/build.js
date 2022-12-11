/******************************************************************************
	CoEditAR Schema Builder
	This NodeJS script analyzes a series of JSON schema files, generates
	combined schema files and creates the documentation files.
******************************************************************************/

'use strict'  // Make sure that we are working on strict mode

// ------------------------------------------------------------- NODEJS MODULES

const fs = require('fs'), 						// File System access
	path = require('path');						// File Path handling

// ----------------------------------------------------------- GLOBAL CONSTANTS

const MAIN_NAMESPACE = 'CoEditAR';
const MAIN_FILENAME = 'coeditar';
const WEBSITE = 'https://coeditar.org';
const SCHEMA_URL = WEBSITE + '/schema/' + MAIN_FILENAME + '.schema.json';;
const PROJECT_FOLDER_PATH = path.resolve(__dirname, '..\\') + '\\';
const SOURCES_FOLDER_PATH = PROJECT_FOLDER_PATH + 'sources\\';
const ROOT_SCHEMA_FILE_PATH = SOURCES_FOLDER_PATH + 'root.schema.json';
const BUILDS_FOLDER_PATH = PROJECT_FOLDER_PATH + 'builds\\';
const BUNDLE_SCHEMA_PATH = BUILDS_FOLDER_PATH + MAIN_FILENAME + '.schema.json';
const TEXT_FILE = {encoding:'utf8'};

// ----------------------------------------------------------- GLOBAL VARIABLES

/** The list of schema files already detected. */
let schemas = {};
let schemaFilePaths = [];


//------------------------------------------------------------ GLOBAL FUNCTIONS

/** Reads a JSON schema file.
 * @param filePath The path to the JSON schema file. */
function readSchemaFile(filePath) {

	// Operate with relative paths
	let relativePath = path.relative(SOURCES_FOLDER_PATH, filePath);

	// Check if the file has already been read, and if so, move it 
	// (and its references) to the end of the list.
	if (schemaFilePaths.includes(relativePath)) {
		let movedItems = [];
		function moveToEndList(item) { 
			if(movedItems.includes(item)) return; else movedItems.push(item);
			schemaFilePaths.splice(schemaFilePaths.indexOf(item), 1);
			schemaFilePaths.push(item);
			for(let reference of schemas[item].references)
				if(reference != item) moveToEndList(reference);
		}
		moveToEndList(relativePath);
		return;
	} else schemaFilePaths.push(relativePath);

	// Read and parse the file data
	console.log('\t\tReading: ' + relativePath);	
	let fileData = fs.readFileSync(path.join(filePath), TEXT_FILE);
	let schemaData = JSON.parse(fileData);

	// Add the data to the collection
	if (!schemaData.title) throw Error("No 'title' property defined");
	let schema = schemas[relativePath] = { name: schemaData.title.toLowerCase(),
		data: schemaData, references: [] };

	// Iteratively detect references to other files
	let items = [schemaData];
	while (items.length > 0) {
		let item = items.shift(), reference = item.$ref;
		if (reference) {
			reference = path.join(path.dirname(filePath), reference);
			if (reference != filePath) readSchemaFile(reference);
			item.$ref = path.relative(SOURCES_FOLDER_PATH, reference);
			if (!schema.references.includes(item.$ref) && reference != filePath)
				schema.references.push(item.$ref);
		}
		for (let k in item) if (typeof item[k]=="object") items.push(item[k]);
	}
}



/** Generates the bundle schema file.
 * @param filePath The path to the JSON schema file. */
function generateBundleSchemaFile(filePath) {
	
	// Create the basic JSON Schema data
	let data = {
		$id: SCHEMA_URL,
		$schema: "http://json-schema.org/draft-07/schema",
		title: MAIN_NAMESPACE + " JSON Schema",
		description: "The JSON schema of the " + MAIN_NAMESPACE + " documents.",
		allOf: [{ "$ref": "#/definitions/root" } ],
	};

	// Create the definitions
	data.definitions = {};
	let schemaIndex, schemaCount = schemaFilePaths.length;
	for (schemaIndex = 0; schemaIndex < schemaCount; schemaIndex++) {
		let schemaFilePath = schemaFilePaths[schemaIndex];
		let schema = schemas[schemaFilePath];
		let schemaData =  Object.assign({}, schema.data);
		data.definitions[schema.name] = schemaData;

		// Remove the $id and $schema properties
		schemaData.$id = undefined;	schemaData.$schema = undefined;

		// Solve inner references
		let items = [schemaData];
		while (items.length > 0) {
			let item = items.shift();
			if (item.$ref && schemas[item.$ref]) 
				item.$ref = "#/definitions/" + schemas[item.$ref].name;
			for (let k in item) if(typeof item[k]=="object")items.push(item[k]);
		}
	}

	// Create the file data
	let fileData = JSON.stringify(data, null, '\t');

	// Try to reduce the number of lines by compressing "leaf" objects and 
	// arrays (within a 80 char limit)
	let lines = fileData.split('\n');
	let comb = "", startIndex = -1, startChar = null;
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		let line = lines[lineIndex], li = line.trim(), 
			firstChar = li[0], lastChar = li[li.length-1];
		
		// Find the char that starts the definition array or an object
		if (((lastChar == '{') || (lastChar == '[')) && lastChar != startChar) {
			startChar = lastChar; startIndex = lineIndex; comb = line; continue;
		}
		
		// Skip until an open char has been found
		if (!startChar) continue;
		
		// Combine the lines until now
		comb += ((comb[comb.length-1]!= ' ')?' ':'') + li;

		// If the size of the line exceeds the size limit, try the next line
		if (comb.replace(/\t/g,'    ').length > 80) {
			lineIndex = startIndex + 1; startChar = null; continue;
		}

		// Continue combining until the end of the definition
		if ((firstChar == '}' && startChar == '{') || 
			(firstChar == ']' && startChar == '[')) {
			lines.splice(startIndex + 1, lineIndex - startIndex);
			lines[startIndex] = comb; lineIndex = 0; startIndex = -1;
		}
	
	}
	fileData = lines.join('\n');

	// Write the bundle schema file
	console.log('\t\tWriting: ' + path.relative(BUILDS_FOLDER_PATH, filePath));	
	fs.writeFileSync(filePath, fileData, TEXT_FILE);
}


//----------------------------------------------------------------- ENTRY POINT

// Clean the console
process.stdout.write('\x1B[2J');
console.log('Initializing Code Generator:');

// Read the schema files
console.log('\tReading schema files:');
readSchemaFile(ROOT_SCHEMA_FILE_PATH);

// Bundle the schema files into a single one
console.log('\tWriting bundle schema file:');
generateBundleSchemaFile(BUNDLE_SCHEMA_PATH);

// Properly end the execution of the script
console.log('ALL DONE'); process.exit(0);
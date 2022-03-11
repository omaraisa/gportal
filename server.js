import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fileUpload from 'express-fileupload';
import azureStorage from 'azure-storage';
import { fileURLToPath } from "url";
import intoStream from 'into-stream';
import path from "path";
import UnzipShapefile from "./modules/upzip-shapefile.js";
import shp2json from "./modules/shp2json.js"
import uploadFile from "./modules/uploader.js"
import {connectDB} from "./db/connect.js"
import {getKey} from "./db/connect.js"
import uploadToAzureStorage from  "./modules/upload-to-azure-storage.js"
//const express = require('express')
// const fileUpload = require('express-fileupload');
// const path = require("path");
// const azureStorage = require('azure-storage')
// const intoStream = require('into-stream')
// const dotenv = require('dotenv'); dotenv.config();
// Global variables
const app = express()
const port = process.env.PORT || 5000;

let AZURE_STORAGE_CONNECTION_STRING;
const containerName = "layerscontainer";
const blobService = azureStorage.createBlobService(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// App configuration
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use(express.json());
app.use('/css', express.static(__dirname + 'assets/css'))
app.use('/js', express.static(__dirname + 'assets/js'))
app.use('/images', express.static(__dirname + 'assets/images'))
app.use('/vendor', express.static(__dirname + 'assets/vendor'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.urlencoded({ extended: false }))
    //app.use(bodyParse.urlencoded({ extended: true }))
app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.get('/', (req, res) => {
    res.render('pages/index.ejs', {
        version: 1.0,
        port: port,
    })
})


// Handle layer upload
app.post("/upload", (request, response) => {
    uploadToAzureStorage(request,response,AZURE_STORAGE_CONNECTION_STRING)
});



app.post('/uploadshp', async(req, res) => {
    res.json(await shp2json(await UnzipShapefile(await uploadFile(req, res, __dirname), __dirname, req, res), req, res))
})



const start = async() => {
    try {
        console.log(`Connecting to Database...`)
        await connectDB()
        console.log(`successfully connected to Database...`)

         const azureStorageKeyId = "622b3af1ce8d01e569bd2e20";
        AZURE_STORAGE_CONNECTION_STRING = getKey(azureStorageKeyId).AZURE_STORAGE_CONNECTION_STRING
        //console.log(await getKey(azureStorageKeyId))
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
        console.log("Sorry, could not connect to database")
    }
}

start()
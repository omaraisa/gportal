import express from 'express';
import fileUpload from 'express-fileupload';
import azureStorage from 'azure-storage';
import { fileURLToPath } from "url";
import intoStream from 'into-stream';
import dotenv from 'dotenv';
dotenv.config();
//const express = require('express')
// const fileUpload = require('express-fileupload');
// const path = require("path");
// const azureStorage = require('azure-storage')
// const intoStream = require('into-stream')
// const dotenv = require('dotenv'); dotenv.config();
// Global variables
const app = express()
const port = process.env.PORT || 5000;
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
app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.get('/', (req, res) => {
    res.render('pages/index', {
        version: 1.0,
        port: port,
    })
})




// Handle layer upload
app.post("/upload", (request, response) => {
    if (!request.files) {
        return response.status(400).send("No files are received.");
    }
    const blobName = request.files.file.name;
    // console.log(`Blob Name ${blobName}`);
    const stream = intoStream(request.files.file.data);
    // console.log(`stream ${stream}`);
    const streamLength = request.files.file.data.length;
    // console.log(`Length ${streamLength}`);
    blobService.createBlockBlobFromStream(
        containerName,
        blobName,
        stream,
        streamLength,
        (err) => {
            if (err) {
                response.status(500);
                response.send({ message: "Error Occured" });
                return;
            }

            var hostName = 'https://mystorageaccountname.blob.core.windows.net';
            var url = blobService.getUrl(containerName, request.files.file.name, null, hostName);

            // console.log(url)
            return response.status(200).json({
                message: 'File Uploaded Successfully',
                url: url
            });
        }
    );
});




// Run the app
app.listen(port, () => {
    console.log(`App listening at port ${port}...`)
})
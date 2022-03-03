const express = require('express')
const fileUpload = require('express-fileupload');
const path = require("path");
// Global variables
const app = express()
const port = process.env.PORT || 5000;

// App configuration
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use('/css', express.static(__dirname + 'assets/css'))
app.use('/js', express.static(__dirname + 'assets/js'))
app.use('/images', express.static(__dirname + 'assets/images'))
app.use('/vendor', express.static(__dirname + 'assets/vendor'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload());
app.get('/', (req, res) => {
    res.render('pages/index', {
        version : 1.0,
        port : port,
    })
})




// Handle layer upload

app.post('/upload', function(req, res) {
  console.log(req)
    let uploadLayer;
    let uploadPath;
    let fileURL;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "uploadLayer") is used to retrieve the uploaded file
    uploadLayer = req.files.file;
    uploadPath = __dirname + '/uploads/' + uploadLayer.name;
    fileURL = req.protocol + '://' + req.get('host') + '/uploads/' + uploadLayer.name;
    // Use the mv() method to place the file somewhere on your server
    uploadLayer.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send(fileURL);
      //console.log(fileURL);
    });
  });



// Run the app
app.listen(port, () => {
    console.log(`App listening at port ${port}...`)
  })

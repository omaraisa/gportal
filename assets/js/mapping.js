mapView()

function mapView() {
    require(["esri/Map",
                "esri/views/MapView",
                "esri/geometry/SpatialReference",
                "esri/layers/FeatureLayer",
                "esri/layers/CSVLayer",
                "esri/layers/GeoJSONLayer",
                "esri/layers/ImageryLayer",
                "esri/layers/TileLayer",
                "esri/layers/KMLLayer",
                //"esri/layers/WFSLayer",
                "esri/layers/WMSLayer",
                "esri/portal/PortalItem",
                "esri/layers/Layer",
                "esri/widgets/Legend",
                "esri/widgets/Sketch",
                "esri/layers/GraphicsLayer", "esri/Graphic",
                "esri/widgets/LayerList",
                "esri/geometry/geometryEngine",
                "esri/widgets/FeatureTable",
                "esri/widgets/Editor",
                "esri/smartMapping/renderers/heatmap",
                "esri/smartMapping/renderers/size",
                "esri/smartMapping/renderers/color",
                "esri/smartMapping/renderers/type",
                "esri/smartMapping/symbology/size",
                "esri/smartMapping/symbology/heatmap",
                "esri/widgets/Print",
                //"esri/widgets/Locate", 
                "esri/widgets/Popup",
                "esri/layers/support/LabelClass",
                "esri/PopupTemplate",
                //"esri/geometry/Extent",
                "esri/widgets/Slider",
                "esri/widgets/ScaleBar",
                "esri/widgets/AreaMeasurement2D",
                "esri/widgets/DistanceMeasurement2D",
                "esri/widgets/Expand",
                "esri/widgets/BasemapToggle",
                "esri/widgets/BasemapGallery",
                "esri/widgets/Zoom"
            ],
            function(Map,
                MapView,
                SpatialReference,
                FeatureLayer,
                CSVLayer,
                GeoJSONLayer,
                ImageryLayer,
                TileLayer,
                KMLLayer,
                //WFSLayer,
                WMSLayer,
                PortalItem,
                Layer,
                Legend,
                Sketch, GraphicsLayer, Graphic,
                LayerList,
                geometryEngine,
                FeatureTable,
                Editor,
                heatmapRendererCreator,
                sizeRendererCreator,
                colorRendererCreator,
                typeRendererCreator,
                sizeSchemes,
                heatmapSchemes,
                Print,
                //Locate, 
                Popup,
                LabelClass,
                PopupTemplate,
                //Extent,
                Slider,
                ScaleBar,
                AreaMeasurement2D,
                DistanceMeasurement2D,
                Expand,
                BasemapToggle,
                BasemapGallery,
                Zoom
            ) {


                let mapsList = {};
                let extentsList = {};
                let activeMap = "الخريطة الافتراضية";
                mapsList[activeMap] = new Map({
                    basemap: "topo-vector" // topo, osm, streets... https://developers.arcgis.com/javascript/3/jsapi/esri.basemaps-amd.html or https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html
                })

                let webMercatorSP = new SpatialReference({
                        wkid: 3857,
                    })
                    //console.log(mapsList)

                let view = new MapView({
                    container: "mapViewDiv",
                    map: mapsList[activeMap],
                    //map: webmap,
                    zoom: 3,
                    //spatialReference: webMercatorSP,
                    center: [0, 0] // Sets center point of view using longitude,latitude
                        //center: [32.550102, 15.58011] // Sets center point of view using longitude,latitude
                })


                //============================================================
                //==================== Graphics ===================================================================================================================================================================
                //============================================================

                let graphicAOI = new GraphicsLayer({
                    title: "نطاق التصدير",
                    listMode: "hide"
                })

                //============================================================
                //==================== Widgets ===================================================================================================================================================================
                //============================================================

                //---------- Zoom ---------------------------


                var zoom = new Zoom({
                    view: view
                });


                //---------- Legend ---------------------------

                let legend = new Legend({
                    view: view,
                })
                view.ui.add(legend, "bottom-right");


                //--------- basemapGallery ----------------------
                let basemapGallery = new BasemapGallery({
                    view: view
                });



                //--------- AreaMeasurement2D ----------------------
                let measureAreaWDGT = new AreaMeasurement2D({
                        view: view,
                        label: "Default label",
                        unit: "square-us-meter"
                    })
                    //view.ui.add(measureAreaWDGT, "top-right")

                //--------- DistanceMeasurement2D ----------------------
                let measureDistanceWDGT = new DistanceMeasurement2D({
                        view: view,
                        label: "Default label",
                        unit: "square-us-meter"
                    })
                    //view.ui.add(measureDistanceWDGT, "top-right")


                //--------- ScaleBar ----------------------
                let scaleBar = new ScaleBar({
                    view: view,
                    unit: "metric"
                });

                //--------- Sketch ----------------------
                let sketchGraphic = new GraphicsLayer({
                    title: "طبقة الرسم"
                })

                let SketchWDGT = new Sketch({
                    layer: sketchGraphic,
                    view: view,
                    //availableCreateTools: ["polygon","rectangle"],
                    creationMode: "single",
                })


                let exportSketch = new Sketch({
                    layer: graphicAOI,
                    view: view,
                    availableCreateTools: ["polygon", "rectangle"],
                    creationMode: "single",
                })



                //--------- Editor ----------------------
                var editor = new Editor({
                    view: view,
                });


                //--------- Print ----------------------
                let printerWidget = new Print({
                    view: view,
                    printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"

                });


                //-------------------------------
                //--------- widgetToggle ----------------------
                //-------------------------------
                let widgetToggles = document.getElementsByClassName("widgetToggle")

                for (let i = 0; i < widgetToggles.length; i++) {
                    widgetToggles[i].addEventListener('change', (event) => {
                        let switchedWidget = event.target.name;

                        if (addLayerWidget)
                            view.ui.remove(addLayerWidget);

                        switch (switchedWidget) {
                            case "legend":
                                if (event.currentTarget.checked) {
                                    view.ui.add(legend, "bottom-right");
                                } else {
                                    view.ui.remove(legend)
                                }
                                break;


                            case "scalebar":
                                if (event.currentTarget.checked) {
                                    view.ui.add(scaleBar, "bottom-right");
                                } else {
                                    view.ui.remove(scaleBar)
                                }
                                break;

                            case "measureDistance":
                                if (event.currentTarget.checked) {
                                    view.ui.add(measureDistanceWDGT, "top-right");
                                } else {
                                    view.ui.remove(measureDistanceWDGT)
                                }
                                break;

                            case "measureArea":
                                if (event.currentTarget.checked) {
                                    view.ui.add(measureAreaWDGT, "top-right");
                                } else {
                                    view.ui.remove(measureAreaWDGT)
                                }
                                break;

                            case "basemap":
                                if (event.currentTarget.checked) {
                                    view.ui.add(basemapGallery, "top-right");
                                } else {
                                    view.ui.remove(basemapGallery)
                                }
                                break;

                            case "editor":
                                if (event.currentTarget.checked) {
                                    view.ui.add(editor, "top-right");
                                } else {
                                    view.ui.remove(editor)
                                }
                                break;

                            case "sketch":
                                if (event.currentTarget.checked) {
                                    mapsList[activeMap].add(sketchGraphic)
                                    view.ui.add(SketchWDGT, "top-right")
                                } else {
                                    view.ui.remove(SketchWDGT)
                                }


                                break;

                            default:

                                break;
                        }
                    });
                }





                //============================================================
                //==================== Custom Widgets ========================================
                //============================================================
                /************** Global Variables *****************/
                let uploadedFile,
                    // selectedLayer in layerList widget
                    selectedLayer,
                    // the index of the selected layer | used to edit the actual layer rather than the event layer
                    layerIndex,
                    // used to determine the current widget to alter its content
                    currentWidget;
                // defining to which menu the back button will navigate
                widgetBackMenus = {
                    symbologyOptionsDiv: "none",
                    simpleRendererDiv: "symbologyOptionsDiv",
                    colorRendererDiv: "symbologyOptionsDiv",
                    uniqueRendererDiv: "symbologyOptionsDiv",
                    sizeRendererDiv: "symbologyOptionsDiv",
                    heatmapRendererDiv: "symbologyOptionsDiv",
                    labelingOptionsDiv: "none",
                    popupConfigDiv: "none",
                    bookmarksDiv: "none",
                    addBookmarkDiv: "bookmarksDiv",
                    scratchLayerDiv: "none",
                    webServiceDiv: "none",
                    csvDiv: "none",
                    kmlLayerDiv: "none",
                    jsonLayerDiv: "none",
                    portalItemDiv: "none",
                    uploadLayerDiv: "none",
                    coordinatesDiv: "uploadLayerDiv",
                    exportDataDiv: "none",
                    bufferAnalysisDiv: "none",
                    intersectionAnalysisDiv: "none",
                    touchAnalysisDiv: "none",
                    nearAnalysisDiv: "none",
                    unionAnalysisDiv: "none",
                    clipAnalysisDiv: "none",
                    symdifAnalysisDiv: "none",
                    selectionDiv: "none",
                    appDescription: "none",
                }


                let addLayerWidget = document.getElementById('addLayerWidgetTemplate').cloneNode(true);
                addLayerWidget.id = "addLayerWidget";

                let backWidgetBtn = document.getElementById('backWidgetBtn').cloneNode(true);
                backWidgetBtn.id = "backWidgetBtn";

                let closeLeftMenu = document.getElementById('closeWidgetBtn').cloneNode(true);
                closeLeftMenu.id = "closeLeftMenu";

                let widgetHeader = document.getElementById('widgetHeader').cloneNode(true);
                widgetHeader.id = "widgetHeader";


                let widgetBuilt = false;

                //-------------------------------
                //--------- Add Layer Method ----------------------
                //-------------------------------
                let addLayerBtn = document.getElementsByClassName("addLayerBtn");
                let webServiceDiv;
                let kmlLayerDiv;
                let jsonLayerDiv;
                let csvDiv;
                let csvLayersIndex = 0;
                let coordinatesDiv;

                for (let i = 0; i < addLayerBtn.length; i++) {
                    addLayerBtn[i].addEventListener('click', (event) => {
                        let targetLayer = event.currentTarget.getAttribute("name");


                        clearLeftWidgets();

                        // Building the widget once
                        if (!widgetBuilt) {


                            // ------   Scratch Layer  --------
                            scratchLayerWidget = document.getElementById('createLayerWidgetTemplate').cloneNode(true);


                            // ------   webServiceDiv --------
                            webServiceDiv = document.createElement("div");
                            webServiceDiv.id = "webServiceDiv";

                            webServiceDiv.innerHTML += "<h4>حدد نوع الطبقة</h4>"
                            let serviceSelector = document.getElementById('selectTemplate').cloneNode(true);
                            serviceSelector.id = "serviceSelector";
                            let webServicesList = ["Feature Service", "Image service"]; //, "WFS", "WMS" "Tile Service",
                            webServicesList.forEach(item => {
                                let option = document.createElement("option")
                                option.value = item
                                option.text = item
                                serviceSelector.appendChild(option)
                            });
                            webServiceDiv.appendChild(serviceSelector);

                            let serviceURL = document.getElementById('inputTextTemplate').cloneNode(true);
                            serviceURL.id = "serviceURL";
                            webServiceDiv.innerHTML += "<h4>أدخل الرابط</h4>"
                            webServiceDiv.appendChild(serviceURL);
                            let addWebServiceBtn = document.getElementById('btnTemplate').cloneNode(true);
                            addWebServiceBtn.id = "addWebServiceBtn";
                            addWebServiceBtn.innerHTML = "إضافة الطبقة";
                            webServiceDiv.appendChild(addWebServiceBtn);
                            addLayerWidget.appendChild(webServiceDiv);




                            // ------   csv Layer --------
                            csvDiv = document.createElement("div");
                            csvDiv.id = "csvDiv";
                            csvDiv.innerHTML += "<h3>طبقة CSV </h3>"
                            csvDiv.innerHTML += "<h4> أدخل الرابط </h4>"
                            let csvURL = document.getElementById('inputTextTemplate').cloneNode(true);

                            csvURL.id = "csvURL";
                            csvDiv.appendChild(csvURL);
                            let addCSVBtn = document.getElementById('btnTemplate').cloneNode(true);
                            addCSVBtn.id = "addCSVBtn";
                            addCSVBtn.innerHTML = "إضافة الطبقة";
                            csvDiv.appendChild(addCSVBtn);
                            addLayerWidget.appendChild(csvDiv);





                            // ------   kmlLayer --------
                            kmlLayerDiv = document.createElement("div");
                            kmlLayerDiv.id = "kmlLayerDiv";
                            kmlLayerDiv.innerHTML += "<h3>طبقة KML </h3>"
                            kmlLayerDiv.innerHTML += "<h4> أدخل الرابط </h4>"
                            let kmlURL = document.getElementById('inputTextTemplate').cloneNode(true);
                            kmlURL.id = "kmlURL";
                            kmlLayerDiv.appendChild(kmlURL);
                            let addKMLBtn = document.getElementById('btnTemplate').cloneNode(true);
                            addKMLBtn.id = "addKMLBtn";
                            addKMLBtn.innerHTML = "إضافة الطبقة";
                            kmlLayerDiv.appendChild(addKMLBtn);
                            addLayerWidget.appendChild(kmlLayerDiv);



                            // ------   jsonLayer --------
                            jsonLayerDiv = document.createElement("div");
                            jsonLayerDiv.id = "jsonLayerDiv";
                            jsonLayerDiv.innerHTML += "<h3>طبقة JSON </h3>"
                            jsonLayerDiv.innerHTML += "<h4> أدخل الرابط </h4>"
                            let jsonURL = document.getElementById('inputTextTemplate').cloneNode(true);
                            jsonURL.id = "jsonURL";
                            jsonLayerDiv.appendChild(jsonURL);
                            let addJsonBtn = document.getElementById('btnTemplate').cloneNode(true);
                            addJsonBtn.id = "addJsonBtn";
                            addJsonBtn.innerHTML = "إضافة الطبقة";
                            jsonLayerDiv.appendChild(addJsonBtn);
                            addLayerWidget.appendChild(jsonLayerDiv);





                            // ------   portal item --------
                            portalItemDiv = document.createElement("div");
                            portalItemDiv.id = "portalItemDiv";

                            portalItemDiv.innerHTML += "<h3> أدخل الرقم التعريفي </h3>"
                            let portalItemID = document.getElementById('inputTextTemplate').cloneNode(true);
                            portalItemID.id = "portalItemID";
                            portalItemID.placeholder = "Portal Item ID";
                            portalItemDiv.appendChild(portalItemID);

                            let addPortalItemBtn = document.getElementById('btnTemplate').cloneNode(true);
                            addPortalItemBtn.id = "addPortalItemBtn";
                            addPortalItemBtn.innerHTML = "إضافة الطبقة";
                            portalItemDiv.appendChild(addPortalItemBtn);
                            addLayerWidget.appendChild(portalItemDiv);


                            // ------   upload Layer  --------
                            uploadLayerDiv = document.createElement("div");
                            uploadLayerDiv.id = "uploadLayerDiv";
                            coordinatesDiv = document.getElementById("coordinatesDiv");
                            uploadLayerDiv.innerHTML += "<h3> رفع طبقة </h3>"
                            uploadLayerDiv.innerHTML += "<p>xlsx, xls, csv, json, geojson, txt, kml, kmz</p>" //, zipped shapefile
                            let uploadingSpin = document.getElementById("uploadingDivTemplate").cloneNode(true);
                            uploadingSpin.id = "uploadingSpin";
                            //uploadingSpin.style.display = "none"
                            uploadLayerDiv.appendChild(uploadingSpin);
                            let LyrUploadForm = document.getElementById('uploadFormTemplate').cloneNode(true);
                            LyrUploadForm.id = "LyrUploadForm";
                            let uploadLayerBtn = LyrUploadForm.children[0];
                            uploadLayerBtn.id = "uploadLayerBtn";
                            uploadLayerDiv.appendChild(LyrUploadForm);
                            addLayerWidget.appendChild(uploadLayerDiv);
                            addLayerWidget.appendChild(coordinatesDiv);




                            widgetBuilt = true;
                        }


                        // Hide all other elements in addLayerWidget
                        let widgetContent = addLayerWidget.children;
                        for (i = 1; i < widgetContent.length; i++) {
                            widgetContent[i].style.display = "none";
                        }




                        switch (targetLayer) {

                            case "scratchLayer":

                                view.ui.add(scratchLayerWidget, "top-left");
                                activateWidgetHeader();
                                activateScratchLayer();


                                break;

                            case "webService":

                                webServiceDiv.style = "display: flex;flex-direction: column;justify-content: flex-start;gap: 10px;line-height: 25px;";
                                view.ui.add(addLayerWidget, "top-left");



                                //Empty the URL input when the service is changed
                                document.getElementById("serviceSelector").addEventListener("change", function() {
                                    document.getElementById("serviceURL").value = "";
                                });


                                document.getElementById("addWebServiceBtn").addEventListener("click", generateWebServiceParameters);

                                activateWidgetHeader();


                                break;


                            case "csvLayer":

                                csvDiv.style = "display: flex;flex-direction: column;justify-content: flex-start;gap: 10px;line-height: 25px;";
                                view.ui.add(addLayerWidget, "top-left");


                                document.getElementById("addCSVBtn").addEventListener("click", addCSVLayer);

                                activateWidgetHeader();



                                break;

                            case "kmlLayer":

                                kmlLayerDiv.style = "display: flex;flex-direction: column;justify-content: flex-start;gap: 10px;line-height: 25px;";
                                view.ui.add(addLayerWidget, "top-left");

                                document.getElementById("addKMLBtn").addEventListener("click", addKMLLayer);
                                activateWidgetHeader();
                                break;

                            case "jsonLayer":

                                jsonLayerDiv.style = "display: flex;flex-direction: column;justify-content: flex-start;gap: 10px;line-height: 25px;";
                                view.ui.add(addLayerWidget, "top-left");

                                document.getElementById("addJsonBtn").addEventListener("click", addJsonLayer);
                                activateWidgetHeader();
                                break;

                            case "portalLayer":


                                portalItemDiv.style = "display: flex;flex-direction: column;justify-content: flex-start;gap: 10px;line-height: 25px;";
                                view.ui.add(addLayerWidget, "top-left");


                                document.getElementById("addPortalItemBtn").addEventListener("click", addPortalLayer);
                                activateWidgetHeader();
                                break;

                            case "uploadLayer":

                                uploadLayerDiv.style = "display: flex;flex-direction: column;justify-content: flex-start;gap: 10px;line-height: 25px;";
                                view.ui.add(addLayerWidget, "top-left");
                                importFile()
                                activateWidgetHeader();
                                break;

                            default:

                                break;



                        }


                    });

                } // For any add layer button pressed 



                function activateScratchLayer() {
                    document.getElementById("scratchLayerFields").addEventListener("change", function() {
                        let fieldsNo = document.getElementById("scratchLayerFields").value;

                        let availableFieldsNo = document.getElementById("scratchLayerFieldsDiv").children.length;
                        if (fieldsNo > availableFieldsNo) {
                            for (i = availableFieldsNo; i < fieldsNo; i++) {
                                var newField = document.getElementById("scratchLayerFieldDiv").cloneNode(true);
                                newField.children[0].value = "";
                                document.getElementById("scratchLayerFieldsDiv").append(newField)
                            }

                        } else if (fieldsNo < availableFieldsNo) {
                            for (i = availableFieldsNo; i > fieldsNo; i--) {
                                document.getElementById("scratchLayerFieldsDiv").removeChild(document.getElementById("scratchLayerFieldsDiv").lastChild);
                            }
                        }

                    });

                    document.getElementById("createScratchLayer").addEventListener("click", function() {
                        let scratchLayerName = document.getElementById("scratchLayerName").value;
                        let scratchLayerGeometry = document.getElementById("scratchLayerGeometry").value;
                        let scratchLayerFieldsList = [{
                            name: "ObjectID",
                            alias: "ObjectID",
                            type: "oid"
                        }];

                        let validInputs = inputsValidation();

                        function inputsValidation() {
                            if (!scratchLayerName) {
                                alert("الرجاء ادخال اسم الطبقة");
                                return false;
                            } else if (scratchLayerGeometry == "") {
                                alert("الرجاء تحديد نوع الطبقة");
                                return false;
                            } else {
                                let scratchLayerFields = document.getElementsByClassName("scratchLayerField");
                                let scratchLayerFieldsTypes = document.getElementsByClassName("scratchLayerFieldType");

                                for (i = 0; i < scratchLayerFields.length - 1; i++) {
                                    if (scratchLayerFields[i].value == "") {
                                        alert("الرجاء إكمال جميع الحقول");
                                        return false;
                                        break;
                                    } else {
                                        let attrField = {
                                            name: scratchLayerFields[i].value,
                                            type: scratchLayerFieldsTypes[i].value
                                        }
                                        scratchLayerFieldsList.push(attrField);

                                    } // else current field is ok
                                    //console.log(i.value)
                                }
                                //console.log(scratchLayerFieldsList)
                                return true;
                            } // else name and geom are ok
                        } // inputsValidation

                        if (validInputs) {
                            let scratchLayer = new FeatureLayer({
                                title: scratchLayerName,
                                source: [],
                                fields: scratchLayerFieldsList,
                                spatialReference: view.spatialReference,
                                geometryType: scratchLayerGeometry,
                            });
                            console.log(scratchLayer)
                            mapsList[activeMap].add(scratchLayer)
                        }
                    });

                }




                function addCSVLayer() {
                    let inputURL = document.getElementById('csvURL').value;
                    csvLayer = new CSVLayer({
                        title: "csvLayer" + csvLayersIndex,
                        url: inputURL, // earthquakes.csv   https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.csv
                        renderer: {
                            type: "simple",
                            symbol: {
                                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                                //style: "square",
                                size: 6,
                                color: "#" + Math.floor(Math.random() * 16777215).toString(16),

                            }
                        },
                        //labelingInfo :[labelClass]
                    })

                    mapsList[activeMap].add(csvLayer)
                    csvLayer.when((response) => {
                        // configure Popup
                        let fieldInfos = [];
                        csvLayer.objectIdField = csvLayer.fields[0].name;
                        csvLayer.fields.forEach(field => {
                            let attrField = {
                                fieldName: field.name
                            }
                            fieldInfos.push(attrField);
                        })

                        let popupTemplate = {
                            title: "العنصر رقم {" + csvLayer.fields[0].name + "}",
                            content: [{
                                type: "fields", // Autocasts as new FieldsContent()
                                // Autocasts as new FieldInfo[]
                                fieldInfos: fieldInfos
                            }]
                        }

                        csvLayer.popupEnabled = true;
                        csvLayer.popupTemplate = popupTemplate;

                        csvLayersIndex += 1;


                    })
                }
                let kmlLayersIndex = 0;

                function addKMLLayer() {
                    let inputURL = document.getElementById('kmlURL').value;
                    let kmlLayer = new KMLLayer({
                        url: inputURL,
                        title: "KML Layer_" + kmlLayersIndex,
                    })
                    mapsList[activeMap].add(kmlLayer)
                    kmlLayersIndex += 1;
                }

                let jsonLayersIndex = 0;

                function addJsonLayer() {
                    let inputURL = document.getElementById('jsonURL').value;
                    let jsonLayer = new GeoJSONLayer({
                        url: inputURL,
                        title: "GeoJsonLayer_" + jsonLayersIndex,
                    })
                    mapsList[activeMap].add(jsonLayer);
                    legend.layerInfos.push({
                        layer: XYLayer,
                        title: "GeoJsonLayer_" + jsonLayersIndex,
                    })
                    jsonLayersIndex += 1;
                }


                function generateWebServiceParameters() {
                    let selectedService = document.getElementById("serviceSelector").value;
                    let inputURL = serviceURL.value;
                    addWebService(selectedService, inputURL)
                }

                function addWebService(selectedService, inputURL) {
                    switch (selectedService) {

                        case "Feature Service":
                            let featureLayer = new FeatureLayer({
                                //https://services6.arcgis.com/nEMEkLg8rZV7Ijyb/arcgis/rest/services/Restaurants/FeatureServer
                                url: inputURL,
                            })
                            mapsList[activeMap].add(featureLayer)
                            featureLayer
                                .when(() => {
                                    return featureLayer.queryExtent();
                                })
                                .then((response) => {
                                    view.goTo(response.extent);
                                });
                            //console.log(featureLayer.title)
                            break;
                        case "Tile Service":
                            let tileLayer = new TileLayer({
                                // url: "https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer",
                                url: inputURL,
                            });
                            mapsList[activeMap].add(tileLayer)

                            tileLayer
                                .when(() => {
                                    view.goTo(tileLayer.fullExtent);
                                });
                            //console.log(tileLayer.title)
                            break;
                        case "Image service":
                            let ImageLayer = new ImageryLayer({
                                // URL to the imagery service
                                //  url: "https://landsat2.arcgis.com/arcgis/rest/services/Landsat8_Views/ImageServer",
                                url: inputURL,
                            });
                            mapsList[activeMap].add(ImageLayer)

                            ImageLayer
                                .when(() => {
                                    view.goTo(ImageLayer.fullExtent);
                                });
                            //console.log(ImageLayer.title)

                            break;

                        case "WFS":
                            let wfsLayer = new WFSLayer({
                                //url: "https://giswebservices.massgis.state.ma.us/geoserver/wfs",
                                url: inputURL,
                            })
                            mapsList[activeMap].add(wfsLayer)
                            break;
                        case "WMS":
                            let wmsLayer = new WMSLayer({
                                //url: "https://giswebservices.massgis.state.ma.us/geoserver/wfs",
                                url: inputURL,
                            })
                            mapsList[activeMap].add(wmsLayer)
                            break;


                        default:

                            break;


                    }
                }

                function addPortalLayer() {
                    let portalLayerID = document.getElementById("portalItemID").value;
                    //console.log(portalLayerID)
                    var portalLayer = new FeatureLayer({
                        portalItem: { // autocasts as new PortalItem()
                            id: portalLayerID //"caa9bd9da1f4487cb4989824053bb847"
                        } // the first layer in the service is returned
                    })
                    mapsList[activeMap].add(portalLayer);
                }


                let XField, YField,
                    fieldInfos = [],
                    fieldsTypes = {},
                    fields = [],
                    popupTemplate = {},
                    XYObjects = [];
                let xLonFieldSelect = document.getElementById("xLonFieldSelect");
                let yLatFieldSelect = document.getElementById("yLatFieldSelect");

                function importFile(evt) {

                    document.getElementById("uploadLayerBtn").addEventListener("change", (evt) => {
                        document.getElementById("uploadingSpin").style.display = "block";
                        document.getElementById("uploadLayerBtn").disabled = true;
                        uploadedFile = evt.target.files[0];
                        evt.preventDefault();

                        let uploadName = uploadedFile.name;
                        let lastDot = uploadName.lastIndexOf('.');
                        //XYFileExt XY File Extension
                        let XYFileName = uploadName.substring(0, lastDot);
                        let XYFileExt = uploadName.substring(lastDot + 1);


                        if (XYFileExt === 'csv' || XYFileExt === 'txt') {
                            uploadCSV();

                        } else if (XYFileExt === 'json' || XYFileExt === 'geojson') {
                            uploadJSON();

                        } else if (XYFileExt === 'xlsx' || XYFileExt === 'xls') {
                            let r = new FileReader()
                            r.onload = e => {
                                XYFeatures = processExcel(e.target.result)
                                XYColumns = Object.keys(XYFeatures[0])
                                    //console.log(XYFeatures)
                                XYLayerHandle()

                            }
                            r.readAsBinaryString(uploadedFile)
                        } else if (XYFileExt === 'kml' || XYFileExt === 'kmz') {
                            uploadKML();
                        } else {
                            //console.log("Nothing has been uploaded")
                            alert("الرجاء رفع احدى الصيغ التالية: xlsx, xls, csv, txt, kml, kmz")
                        }


                        async function uploadCSV() {
                            let formData = new FormData()
                            formData.append("file", uploadedFile)

                            let fileURL;
                            $.ajax({
                                global: false,
                                type: 'POST',
                                url: "/upload",
                                processData: false,
                                contentType: false,
                                data: formData,
                                success: function(result) {
                                    fileURL = result.url
                                    $.get(fileURL, function(CSVdata) {

                                        XYFeatures = $.csv.toObjects(CSVdata);

                                        XYColumns = Object.keys(XYFeatures[0])
                                            //console.log(XYColumns)

                                        /****** Convert csv numeric values stored as strings ************/

                                        XYFeatures.forEach(correctType)

                                        function correctType(feature, index) {
                                            for (const key in feature) {

                                                if (feature.hasOwnProperty(key)) {
                                                    let numeric = Number(feature[key])
                                                    if (isNaN(numeric)) {} else
                                                        feature[key] = numeric
                                                        //console.log(`${key}: ${feature[key]}`);
                                                }
                                                XYFeatures[index] = feature
                                                    //console.log(XYFeatures)
                                            }
                                        }


                                        /**************** XYFileType Ends  *******************/


                                        XYLayerHandle()
                                    });

                                },
                                error: function(request, status, error) {
                                    document.getElementById("uploadingSpin").style.display = "none";
                                    document.getElementById("uploadLayerBtn").disabled = false;
                                    alert("عذراً تعذر رفع الملف!");
                                    console.log(error);
                                }

                            });


                        } //uploadCSV

                        async function uploadJSON() {

                            let formData = new FormData()
                            formData.append("file", uploadedFile)

                            let fileURL;
                            $.ajax({
                                global: false,
                                type: 'POST',
                                url: "/upload",
                                processData: false,
                                contentType: false,
                                data: formData,
                                success: function(result) {
                                    document.getElementById("uploadingSpin").style.display = "none";
                                    document.getElementById("uploadLayerBtn").disabled = false;
                                    fileURL = result.url
                                    let uploadedJsonLayer = new GeoJSONLayer({
                                        url: fileURL,
                                        title: XYFileName,
                                    });
                                    mapsList[activeMap].add(uploadedJsonLayer);
                                },
                                error: function(request, status, error) {
                                    document.getElementById("uploadingSpin").style.display = "none";
                                    document.getElementById("uploadLayerBtn").disabled = false;
                                    alert("عذراً تعذر رفع الملف!");
                                    console.log(error);
                                }
                            });

                        } //uploadJSON


                        async function uploadKML() {

                            let formData = new FormData()
                            formData.append("file", uploadedFile)

                            $.ajax({
                                global: false,
                                type: 'POST',
                                url: "/upload",
                                processData: false,
                                contentType: false,
                                data: formData,
                                success: function(result) {
                                    document.getElementById("uploadingSpin").style.display = "none";
                                    document.getElementById("uploadLayerBtn").disabled = false;
                                    const kmlLayer = new KMLLayer({
                                        url: result.url,
                                        title: "KML Layer_" + kmlLayersIndex,
                                    })
                                    mapsList[activeMap].add(kmlLayer)
                                    legend.layerInfos.push({
                                        layer: kmlLayer,
                                        title: "KML Layer_" + kmlLayersIndex,
                                    })
                                    kmlLayersIndex += 1;
                                    kmlLayer
                                        .when(() => {
                                            view.goTo(kmlLayer.fullExtent);
                                        });
                                },
                                error: function(request, status, error) {
                                    document.getElementById("uploadingSpin").style.display = "none";
                                    document.getElementById("uploadLayerBtn").disabled = false;
                                    alert("عذراً تعذر رفع الملف!");
                                    console.log(error);
                                }
                            });

                        } //uploadKML


                        function XYLayerHandle() {
                            document.getElementById("uploadingSpin").style.display = "none";
                            document.getElementById("uploadLayerBtn").disabled = false;
                            widgetNavigator("addLayerWidget", "coordinatesDiv")


                            XYColumns.forEach(addColumnsToList)

                            function addColumnsToList(column, index) {
                                var option = document.createElement("option")
                                option.value = column
                                option.text = column
                                let optionClone = option.cloneNode(true);;
                                xLonFieldSelect.appendChild(option)
                                yLatFieldSelect.appendChild(optionClone)


                                // Searching for coordinates fields : Longitute Lon X | Latitude Lat Y
                                var lowerColumn = column.toLowerCase()
                                if (lowerColumn === 'longitude' || lowerColumn === 'long' || lowerColumn === 'lon' || lowerColumn === 'x' || lowerColumn === 'easting')
                                    XField = column

                                if (lowerColumn === 'latitude' || lowerColumn === 'lat' || lowerColumn === 'y' || lowerColumn === 'northing')
                                    YField = column

                                //Collecting the columns names for later usage for layer attributes
                                let attrField = {
                                    fieldName: column
                                }
                                fieldInfos.push(attrField)


                                // Getting the current field/column value to check it's type
                                let currentFeature = XYFeatures[index];
                                //let currentColumn = currentFeature[column];
                                let type


                                switch (typeof currentFeature[column]) {
                                    case "string":
                                        type = "string"
                                        break
                                    default:
                                        type = "double"
                                }
                                //console.log(type)

                                // Saving the fields types to use this in the symbology with auto renderer select
                                fieldsTypes[column] = type


                                let field = {
                                    name: column,
                                    type: type
                                }
                                fields.push(field)

                            } // forEach | addColumnsToList



                            if (typeof XField !== "undefined") { //console.log("X")
                                for (var i = 0; i < xLonFieldSelect.options.length; i++) { //let selectedIndex          
                                    //console.log("for index:" +i + " index:" +xLonFieldSelect.selectedIndex)                            
                                    if (xLonFieldSelect.options[i].value === XField) {
                                        xLonFieldSelect.value = XField;
                                        //console.log(xLonFieldSelect.options[i])
                                        xLonFieldSelect.options[i].value = xLonFieldSelect.options[0].value
                                        xLonFieldSelect.options[i].text = xLonFieldSelect.options[0].text
                                        xLonFieldSelect.options[0].value = XField
                                        xLonFieldSelect.options[0].text = XField
                                        xLonFieldSelect.options[0].selected = true;

                                        break;
                                    }

                                }
                            }


                            if (typeof YField !== "undefined") { //console.log("Y")
                                for (var i = 0; i < yLatFieldSelect.options.length; i++) {
                                    if (yLatFieldSelect.options[i].value === YField) {
                                        yLatFieldSelect.selectedIndex = i;
                                        yLatFieldSelect.value = YField;
                                        break;
                                    }
                                }
                            }


                            let XYLayer = new FeatureLayer({})

                            addXYtoMapBtn.addEventListener('click', addXYtoMap)

                            function addXYtoMap() {
                                var xLonField = document.getElementById('xLonFieldSelect').value
                                var yLatField = document.getElementById('yLatFieldSelect').value



                                XYFeatures.forEach(pushFeatures)

                                function pushFeatures(feature, index) {
                                    //console.log(feature)
                                    var xLon = feature[xLonField]
                                    var yLat = feature[yLatField]
                                        //console.log(xLon,yLat)

                                    feature.ObjectID = index


                                    let point = {
                                        type: "point", // autocasts as new Point()
                                        longitude: xLon,
                                        latitude: yLat
                                    }

                                    // Create a symbol for drawing the point
                                    let markerSymbol = {
                                        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                                        color: [226, 119, 40]
                                    }

                                    let polylineAtt = {
                                        Name: "Keystone Pipeline",
                                        Owner: "TransCanada"
                                    }


                                    // Create a graphic and add the geometry and symbol to it
                                    pointGraphic = new Graphic({
                                        geometry: point,
                                        symbol: markerSymbol,
                                        attributes: feature,
                                        popupTemplate: popupTemplate,
                                    })

                                    //console.log(pointGraphic)
                                    //XYLayer.graphics.push(pointGraphic)


                                    XYObjects.push(pointGraphic)

                                } //---------END forEach ------------------------
                                //console.log(XYObjects)
                                let XYLayerPopup = {
                                    title: "العنصر رقم {ObjectID}",
                                    content: [{
                                        type: "fields", // Autocasts as new FieldsContent()
                                        // Autocasts as new FieldInfo[]
                                        fieldInfos: fieldInfos
                                    }]
                                }
                                XYLayer.source = XYObjects
                                fields.push({
                                    name: "ObjectID",
                                    type: "oid"
                                })
                                XYLayer.fields = fields
                                XYLayer.objectIdField = "ObjectID"
                                XYLayer.geometryType = "point"
                                XYLayer.popupTemplate = XYLayerPopup
                                    //XYLayer.renderer = XYSimpleRenderer
                                XYLayer.title = XYFileName;

                                mapsList[activeMap].add(XYLayer);
                                legend.layerInfos.push({
                                    layer: XYLayer,
                                    title: XYFileName,
                                })

                                fixLayerListUI()
                            } //addXYtoMap


                        } // XYLayerHandle

                    });
                } //  importFile(evt)

                function processExcel(data) {
                    let workbook = XLSX.read(data, {
                        type: 'binary'
                    })
                    let filename = uploadLayerBtn.name.substring(0, uploadLayerBtn.name.indexOf("."))
                    let firstSheetName = workbook.SheetNames[0]
                    let firstSheet = workbook.Sheets[firstSheetName]
                    let newWorkSheet = XLSX.utils.sheet_to_json(firstSheet)
                    let newWorkbook = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(newWorkbook, newWorkSheet, "CSV_Sheet")
                        //XLSX.writeFile(newWorkbook, "file.csv")

                    return newWorkSheet
                }



                //----------- Select & Export ------------------------------------------------------------------------------------------------------

                const exportDataDiv = document.getElementById("exportDataDiv").cloneNode(true);
                let extractedData, extractExtension = ".csv";
                let extractDataBtn = document.getElementById("extractDataBtn");

                function extractData() {


                    mapsList[activeMap].add(graphicAOI);

                    view.ui.add(exportSketch, "top-right")


                    exportSketch.on("create", function(event) {
                        extractedData = null;
                        if (event.state === "complete") {
                            graphicAOI.remove(event.graphic)
                                //view.graphics.removeAll()

                            //console.log(event.graphic.geometry)


                            let query = selectedLayer.createQuery()
                            query.geometry = event.graphic.geometry
                            query.spatialRelationship = "intersects"
                            query.returnGeometry = true

                            selectedLayer.queryFeatures(query)
                                .then(function(response) {
                                    //console.log(response)
                                    let geometriesArray = response.features.map(function(feature) {
                                        return feature.geometry
                                    });



                                    switch (response.geometryType) {
                                        case 'point':
                                            extractExtension = ".csv"
                                            querySymbol = selectedPointsSymbol;
                                            let featuresTable = []

                                            let resultFeatures = response.features
                                            resultFeatures.forEach(featureTotable)

                                            function featureTotable(feature) {
                                                //console.log(feature.attributes)
                                                featuresTable.push(feature.attributes)
                                            }
                                            //console.table("featuresTable")
                                            //console.table(featuresTable)

                                            extractedData = $.csv.fromObjects(featuresTable)
                                                //console.log("extractedData")
                                                //console.log(extractedData)
                                                // Download csv file
                                            break;
                                        case 'polyline':
                                            extractExtension = ".json"
                                            querySymbol = selectedLinesSymbol;
                                            extractedData = JSON.stringify(response);
                                            break;
                                        case 'polygon':
                                            querySymbol = selectedPolygonsSymbol;
                                            extractedData = JSON.stringify(response);
                                            extractExtension = ".json"
                                            break;
                                        default:
                                            alert("عذراً لا يمكن تصدير بيانات هذه الطبقة");
                                            break;

                                    }
                                    view.graphics.removeAll();
                                    geometriesArray.forEach(drawResultFun);

                                    function drawResultFun(geom) {
                                        let selectedFeature = new Graphic({
                                            geometry: geom,
                                            symbol: querySymbol
                                        })
                                        view.graphics.add(selectedFeature)
                                    }

                                    if (response.features.length > 0) {
                                        document.getElementById("extractDataBtn").disabled = false
                                        document.getElementsByClassName("extractDataBtn")[0].style.background = "green";
                                    }


                                })


                        }
                    })

                }


                function activateExportingListeners() {
                    if (document.getElementById('fetchSketch')) {
                        let fetchSketch = document.getElementById('fetchSketch');
                        fetchSketch.addEventListener('change', (event) => {
                            if (fetchSketch.checked == true) {
                                extractData();
                            } else {
                                view.ui.remove(exportSketch);
                                mapsList[activeMap].remove(graphicAOI);
                                document.getElementById("extractDataBtn").disabled = true;
                                document.getElementsByClassName("extractDataBtn")[0].style.background = "gray"
                            }

                        });
                    }

                    document.getElementById("extractDataBtn").addEventListener('click', function() {
                        downloadBlobAsFile(extractedData, selectedLayer.title + "_extraction" + extractExtension)
                    });



                } // activateExportingListeners



                //============================================================
                //==================== Symbols ========================================
                //============================================================
                let PointsSymbol = {
                    type: "simple-marker",
                    style: "circle", // circle,cross,diamond
                    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                    size: "8px", // pixels
                }
                let LinesSymbol = {
                    type: "simple-line",
                    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                    width: 3
                }
                let PolygonsSymbol = {
                    type: "simple-fill",
                    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                    outline: {
                        color: "rgba(255,255,255,1)",
                        width: 2,
                    }
                }


                let selectedPointsSymbol = {
                    type: "simple-marker",
                    style: "circle", // circle,cross,diamond
                    color: "rgba(0,255,255,1)",
                    size: "8px", // pixels
                }


                let selectedLinesSymbol = {
                    type: "simple-line",
                    color: "rgba(0,255,255,1)",
                    width: 3
                }

                let selectedPolygonsSymbol = {
                    type: "simple-fill",
                    color: "rgba(255,255,255,0)",
                    outline: {
                        width: 2,
                        color: "rgba(0,255,255,1)"
                    }
                };


                //============================================================
                //====================Visual letiables=============================================================================================================================================================
                //============================================================



                //============================================================
                //====================Renderers======================================================================================================================================================
                //============================================================
                let simplePointsRenderers = {
                    type: "simple",
                    symbol: {
                        type: "simple-marker",
                        style: "circle", // circle,cross,diamond
                        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                        size: "8px", // pixels
                    }
                }
                let simpleLinesRenderers = {
                    type: "simple",
                    symbol: {
                        type: "simple-line",
                        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                        width: 3
                    }
                }
                let simplePolylinesRenderers = {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                        outline: {
                            color: "rgba(255,255,255,1)",
                            width: 2,
                        }
                    }
                }




                let circleSymbol = {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    //style: "square",
                    size: 6,
                    color: "#57007F",
                    outline: { // autocasts as new SimpleLineSymbol()
                        width: 0.5,
                        color: "black"
                    }
                }

                let XYSimpleRenderer = {
                    type: "simple", // autocasts as new SimpleRenderer()
                    //symbol: arrowSym,
                    //symbol: cimSymbol,
                    symbol: circleSymbol
                }


                let heatmapParams = {
                    //layer: earthquakeLayer,
                    view: view,
                    //field: "magnitude"
                };



                let XYUniquevalueRenderer = {
                    /*
                                            type: "unique-value", // autocasts as new UniqueValueRenderer()
                                        field: "magType",
                                        field2: "locationSource",
                                        fieldDelimiter: ", ",
                                        legendOptions: {
                                            title: "عنوان المفتاح"
                                        },
                                        defaultLabel: "باقي النقاط",
                                        defaultSymbol: {
                                            type: "simple-marker"
                                        }, // autocasts as new SimpleFillSymbol()
                    */


                    type: "unique-value", // autocasts as new UniqueValueRenderer()
                    defaultSymbol: {
                        type: "simple-marker"
                    }, // autocasts as new SimpleFillSymbol()
                    /*
                    uniqueValueInfos: [{
                        // All features with value of "North" will be blue
                        value: "mb, us",
                        symbol: {
                            type: "simple-marker", // autocasts as new SimpleFillSymbol()
                            color: "yellow"
                        }
                    } ],*/
                }



                //============================================================
                //====================Symbology======================================================================================================================================================
                //============================================================

                const symbologyWidget = document.getElementById('symbologyWidgetTemplate').cloneNode(true);
                symbologyWidget.id = "symbologyWidget";
                const exportDataWidget = document.getElementById('exportDataWidgetTemplate').cloneNode(true);
                exportDataWidget.id = "exportDataWidget";
                //let symbologyCustomizerDiv = document.getElementById("symbologyCustomizerDiv").cloneNode(true);
                //symbologyCustomizerDiv.id = "symbologyCustomizerDiv";
                let simpleRendererDiv = document.getElementById("simpleRendererDiv").cloneNode(true);
                simpleRendererDiv.id = "simpleRendererDiv";
                let colorRendererDiv = document.getElementById("colorRendererDiv").cloneNode(true);
                colorRendererDiv.id = "colorRendererDiv";
                let uniqueRendererDiv = document.getElementById("uniqueRendererDiv").cloneNode(true);
                uniqueRendererDiv.id = "uniqueRendererDiv";
                let sizeRendererDiv = document.getElementById("sizeRendererDiv").cloneNode(true);
                sizeRendererDiv.id = "sizeRendererDiv";
                let heatmapRendererDiv = document.getElementById("heatmapRendererDiv").cloneNode(true);
                heatmapRendererDiv.id = "heatmapRendererDiv";
                let symbologyField,
                    symbologySelector,
                    selectedRenderer,
                    symbologyOptionsDiv,
                    simpleSizeInput,
                    simpleOutlineSizeInput,
                    colorParams,
                    sizeParams,
                    typeParams,
                    symbolSize;

                // Defining basic symbols to be used by any type of renderer
                let XYSimpleSymbolInput = document.getElementById('selectTemplate').cloneNode(true)
                XYSimpleSymbolInput.id = "XYSimpleSymbolInput"

                let simpleSymbolsAry = ["circle", "square", "diamond", "triangle", "cross", "x"]
                simpleSymbolsAry.forEach(listSimpleSymbols)

                function listSimpleSymbols(symbol, index) {
                    let option = document.createElement("option")
                    option.value = symbol
                    option.text = symbol
                    XYSimpleSymbolInput.appendChild(option)
                }



                function activateSymbologyListeners() {
                    let symbologyFields = document.getElementById('symbologyFields');
                    let customizeRendererBtn = document.getElementById('customizeRendererBtn');
                    symbologySelector = document.getElementById('symbologySelector');



                    document.getElementById('symbologyFields').addEventListener('change', symbologyChangeHandler);

                    function symbologyChangeHandler() {
                        symbologyField = document.getElementById('symbologyFields').value;

                        if (symbologySelector.value === '') {
                            symbologyLister(event);

                            if (customizeRendererBtn.disabled === true) {
                                customizeRendererBtn.disabled = false;
                                customizeRendererBtn.style.background = "#547E4E";
                            }
                        } else {
                            applyRenderer();
                            symbologyLister(event);
                        }

                    }

                    document.getElementById('customizeRendererBtn').addEventListener('click', (event) => {
                        if (symbologySelector.value === 'none') {
                            alert("الرجاء تحديد نوع التمثيل");
                        } else {
                            //widgetNavigator("symbologyWidget", "symbologyCustomizerDiv");
                            //let selectedSymbology = document.getElementById('symbologySelector').value;
                            customizeRenderer();



                        }
                    });





                    // Listen to renderer change
                    symbologySelector.addEventListener('change', applyRenderer);

                    function applyRenderer() {
                        selectedRenderer = symbologySelector.value
                        let symbologyField = document.getElementById('symbologyFields').value
                        switch (selectedRenderer) {
                            case 'simple':

                                switch (selectedLayer.geometryType) {
                                    case 'point':
                                        simplePolylinesRenderers.symbol.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                                        selectedLayer.renderer = simplePointsRenderers
                                        break;
                                    case 'polyline':
                                        simplePolylinesRenderers.symbol.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                                        selectedLayer.renderer = simpleLinesRenderers
                                        break;
                                    case 'polygon':
                                        simplePolylinesRenderers.symbol.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                                        selectedLayer.renderer = simplePolylinesRenderers
                                        break;
                                    default:
                                        console.log("Invalid geometry")
                                }


                                break

                            case 'unique':

                                typeParams = {
                                    layer: selectedLayer,
                                    field: symbologyField,
                                    //sortBy: "count"
                                };

                                // when the promise resolves, apply the renderer to the layer
                                typeRendererCreator.createRenderer(typeParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    });


                                break

                            case 'color':
                                colorParams = {
                                    layer: selectedLayer,
                                    view: view,
                                    field: symbologyField,
                                    //theme: "above",
                                    classificationMethod: "quantile", //equal-interval,  natural-breaks standard-deviation	
                                    numClasses: 4,
                                    defaultSymbolEnabled: false,
                                };

                                // when the promise resolves, apply the renderer to the layer
                                colorRendererCreator.createClassBreaksRenderer(colorParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    });
                                break




                            case 'size':
                                sizeParams = {
                                    layer: selectedLayer,
                                    view: view,
                                    field: symbologyField,
                                    //normalizationField: "TOTPOP_CY",
                                    classificationMethod: "quantile", //equal-interval,  natural-breaks standard-deviation	
                                    defaultSymbolEnabled: false,
                                    numClasses: 4,

                                }

                                // when the promise resolves, apply the renderer to the layer
                                sizeRendererCreator.createClassBreaksRenderer(sizeParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    })

                                break




                            case 'heatmap':
                                heatmapParams.layer = selectedLayer
                                heatmapParams.field = symbologyField
                                    //heatmapParams.blurRadius  = 20
                                    //heatmapParams.minRatio   = 0.1
                                    //heatmapParams.maxRatio   = 1
                                    // when the promise resolves, apply the renderer to the layer
                                heatmapRendererCreator.createRenderer(heatmapParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    });



                                break



                            default:

                        }

                    } //applyRenderer





                    function customizeRenderer() {

                        //symbologyCustomizerDiv.style.lineHeight = 2
                        //symbologyDiv.style.display = "none" sizeSliderDiv
                        if (selectedLayer.geometryType === "polygon") {
                            document.getElementById("simpleSizeController").style.display = "none";
                            document.getElementById("colorPointsSize").style.display = "none";
                            document.getElementById("colorPointsSymbol").style.display = "none";
                        } else {
                            document.getElementById("simpleSizeController").style.display = "flex";
                            document.getElementById("colorPointsSize").style.display = "flex";
                            document.getElementById("colorPointsSymbol").style.display = "flex";
                        }
                        switch (selectedRenderer) {
                            case 'simple':
                                if (selectedLayer.geometryType === "polygon") {
                                    document.getElementById("simpleSymbolController").style.display = "none";
                                } else {
                                    document.getElementById("simpleSymbolController").style.display = "flex";
                                }

                                widgetNavigator("symbologyWidget", "simpleRendererDiv");
                                if (simpleSizeInput === undefined) {
                                    simpleSizeInput = new Slider({
                                        container: "simpleSizeInput",
                                        min: 3,
                                        max: 80,
                                        steps: 1,
                                        values: [12],
                                        snapOnClickEnabled: false,
                                        visibleElements: {
                                            labels: true,
                                            rangeLabels: true
                                        }
                                    })

                                    simpleOutlineSizeInput = new Slider({
                                        container: "simpleOutlineSizeInput",
                                        min: 0,
                                        max: 5,
                                        values: [0.5],
                                        steps: 0.5,
                                        snapOnClickEnabled: true,
                                        visibleElements: {
                                            labels: true,
                                            rangeLabels: true
                                        }
                                    })
                                }


                                var activeInputs = document.querySelectorAll('input');




                                for (i of activeInputs) {
                                    i.addEventListener('input', function() {
                                        //console.log(this.id);
                                        let currentInputID = this.id;

                                        switch (currentInputID) {
                                            case 'simpleColorInput':
                                                var tempRenderer = selectedLayer.renderer.clone();
                                                var selectedColor = this.value;
                                                tempRenderer.symbol.color = selectedColor;
                                                selectedLayer.renderer = tempRenderer;
                                                break;


                                            case 'simpleOutlineColorInput':
                                                var tempRenderer = selectedLayer.renderer.clone();
                                                const selectedOutlineColor = this.value;
                                                tempRenderer.symbol.outline.color = selectedOutlineColor;
                                                selectedLayer.renderer = tempRenderer;
                                                break;


                                            default:
                                        }


                                    });
                                }


                                simpleSizeInput.on("thumb-drag", function() {
                                    var tempRenderer = selectedLayer.renderer.clone();
                                    var selectedSize = simpleSizeInput.values[0];
                                    tempRenderer.symbol.size = selectedSize;
                                    selectedLayer.renderer = tempRenderer;
                                });


                                simpleOutlineSizeInput.on("thumb-drag", function() {
                                    var tempRenderer = selectedLayer.renderer.clone();
                                    var selectedSize = simpleOutlineSizeInput.values[0];
                                    tempRenderer.symbol.outline.width = selectedSize;
                                    selectedLayer.renderer = tempRenderer;
                                });

                                layerLegendSwitch('simpleLegendToggle');
                                break;


                                // Customizing Color Renderer

                            case 'color':
                                widgetNavigator("symbologyWidget", "colorRendererDiv");
                                document.getElementById("sizeSliderDiv").innerHTML = "";
                                const sizeSlider = new Slider({
                                    container: "sizeSliderDiv",
                                    min: 3,
                                    max: 40,
                                    values: [12],
                                    snapOnClickEnabled: false,
                                    visibleElements: {
                                        labels: false,
                                        rangeLabels: true
                                    }
                                })

                                //console.log(XYLayer.renderer)

                                sizeSlider.on("thumb-drag", function() {
                                    var tempRenderer = selectedLayer.renderer.clone();
                                    symbolSize = sizeSlider.values[0];
                                    //tempRenderer.defaultSymbol.size = symbolSize
                                    var tempClassBreakInfos = tempRenderer.classBreakInfos;
                                    tempClassBreakInfos.forEach(alterClassBreakInfos);

                                    function alterClassBreakInfos(item, index) {
                                        tempClassBreakInfos[index].symbol.size = symbolSize;
                                    }
                                    tempRenderer.classBreakInfos = tempClassBreakInfos;
                                    selectedLayer.renderer = tempRenderer;
                                })



                                layerLegendSwitch('colorLegendToggle');
                                break






                            case 'size':
                                widgetNavigator("symbologyWidget", "sizeRendererDiv");
                                layerLegendSwitch('sizeLegendToggle');



                                var activeInputs = document.querySelectorAll('input');




                                for (i of activeInputs) {
                                    i.addEventListener('input', function() {
                                        //console.log(this.id);
                                        let currentInputID = this.id;

                                        switch (currentInputID) {
                                            case 'sizeColorInput':
                                                var tempRenderer = selectedLayer.renderer.clone()
                                                var selectedColor = this.value;
                                                //tempRenderer.defaultSymbol.style = selectedSymbol
                                                var tempClassBreakInfos = tempRenderer.classBreakInfos;
                                                tempClassBreakInfos.forEach(alterClassBreakInfosColor)

                                                function alterClassBreakInfosColor(item, index) {
                                                    tempClassBreakInfos[index].symbol.color = selectedColor
                                                }
                                                tempRenderer.classBreakInfos = tempClassBreakInfos
                                                selectedLayer.renderer = tempRenderer

                                                break;


                                            default:
                                        }


                                    });
                                }

                                break;





                            case 'unique':
                                widgetNavigator("symbologyWidget", "uniqueRendererDiv");
                                // Show or hide from legend

                                layerLegendSwitch('uniqueLegendToggle');
                                break;



                            case 'heatmap':
                                widgetNavigator("symbologyWidget", "heatmapRendererDiv");


                                let heatmapAry = ["Heatmap 1", "Heatmap 2", "Heatmap 3", "Heatmap 4", "Heatmap 5", "Heatmap 6", "Heatmap 7", "Heatmap 8", "Heatmap 9", "Heatmap 10", "Heatmap 11", "Heatmap 12", "Heatmap 13", "Heatmap 14", "Heatmap 15", "Heatmap 16", "Heatmap 17", "Heatmap 18", "Heatmap 19", "Heatmap 20"];
                                let heatmapSelect = document.getElementById('heatmapSelect');
                                heatmapSelect.id = "heatmapSelect"
                                heatmapAry.forEach(item => {
                                    var option = document.createElement("option")
                                    option.value = item
                                    option.text = item
                                    heatmapSelect.appendChild(option)
                                });

                                const ratioRangeSlider = new Slider({
                                    container: "ratioRangeSliderDiv",
                                    min: 0.1,
                                    max: 1,
                                    values: [0.1, 1],
                                    steps: 0.1,
                                    //minLabelElement,
                                    //segmentElements,
                                    //thumbElements,
                                    thumbsConstrained: false,
                                    rangeLabelInputsEnabled: true,
                                    syncedSegmentsEnabled: true,
                                    snapOnClickEnabled: false,
                                    visibleElements: {
                                        labels: true,
                                        rangeLabels: true
                                    }
                                })
                                ratioRangeSlider.on("thumb-drag", function() {
                                    //sizeRangeSlider._labelElements.forEach( labelElement => labelElement.classList.add("sliderLabels") )

                                    heatmapParams.minRatio = ratioRangeSlider.values[0]
                                    heatmapParams.maxRatio = ratioRangeSlider.values[1]

                                    // when the promise resolves, apply the renderer to the layer
                                    heatmapRendererCreator.createRenderer(heatmapParams)
                                        .then(function(response) {
                                            selectedLayer.renderer = response.renderer;

                                        })
                                })



                                // changing heatmap blurRadius

                                const blurRangeSlider = new Slider({
                                    container: "blurRangeSliderDiv",
                                    min: 1,
                                    max: 20,
                                    values: [10],
                                    steps: 2,
                                    //minLabelElement,
                                    //segmentElements,
                                    //thumbElements,
                                    thumbsConstrained: false,
                                    rangeLabelInputsEnabled: true,
                                    syncedSegmentsEnabled: true,
                                    snapOnClickEnabled: false,
                                    visibleElements: {
                                        labels: true,
                                        rangeLabels: true
                                    }
                                })

                                blurRangeSlider.on("thumb-drag", function() {
                                    //sizeRangeSlider._labelElements.forEach( labelElement => labelElement.classList.add("sliderLabels") )

                                    heatmapParams.blurRadius = blurRangeSlider.values[0]

                                    // when the promise resolves, apply the renderer to the layer
                                    heatmapRendererCreator.createRenderer(heatmapParams)
                                        .then(function(response) {
                                            selectedLayer.renderer = response.renderer;

                                        })
                                })


                                layerLegendSwitch('heatmapLegendToggle');

                                break



                            default:

                        } // End Switch Inputs

                        // Listen to change for Symbol style selector in Simple Renderer
                        if (document.getElementById('simpleSymbolSelector')) {
                            document.getElementById('simpleSymbolSelector').addEventListener('change', (event) => {
                                var tempRenderer = selectedLayer.renderer.clone();
                                const selectedSymbol = document.getElementById('simpleSymbolSelector').selectedOptions[0].value;
                                tempRenderer.symbol.style = selectedSymbol;
                                selectedLayer.renderer = tempRenderer;
                            })
                        }


                        // Listen to change for Symbol style selector in Color Renderer
                        if (document.getElementById('colorRendererSymbol')) {
                            document.getElementById('colorRendererSymbol').addEventListener('change', (event) => {
                                var tempRenderer = selectedLayer.renderer.clone();
                                const selectedSymbol = document.getElementById('colorRendererSymbol').selectedOptions[0].value
                                    //tempRenderer.defaultSymbol.style = selectedSymbol
                                const tempClassBreakInfos = tempRenderer.classBreakInfos
                                tempClassBreakInfos.forEach(alterClassBreakInfos)

                                function alterClassBreakInfos(item, index) {
                                    tempClassBreakInfos[index].symbol.style = selectedSymbol
                                }
                                tempRenderer.classBreakInfos = tempClassBreakInfos
                                selectedLayer.renderer = tempRenderer
                            })
                        }




                        // Listen to change for classificationMethod in Color Renderer
                        if (document.getElementById('colorClassificationMethods')) {
                            document.getElementById('colorClassificationMethods').addEventListener('change', (event) => {
                                let selectedMethod = document.getElementById('colorClassificationMethods').selectedOptions[0].value
                                colorParams.classificationMethod = selectedMethod;
                                // when the promise resolves, apply the renderer to the layer
                                colorRendererCreator.createClassBreaksRenderer(colorParams)
                                    .then(function(response) {
                                        if (symbolSize === undefined) {
                                            selectedLayer.renderer = response.renderer;
                                        }
                                        // apply the user selected size on the new response
                                        else {
                                            var tempRenderer = response.renderer;
                                            tempRenderer.classBreakInfos.forEach(alterClassBreakInfos)

                                            function alterClassBreakInfos(item, index) {
                                                tempRenderer.classBreakInfos[index].symbol.size = symbolSize
                                            }
                                            selectedLayer.renderer = tempRenderer;
                                        }

                                    });
                            })
                        }



                        // Listen to change in number of classes
                        if (document.getElementById('colorClassesNo')) {
                            document.getElementById('colorClassesNo').addEventListener('change', (event) => {
                                let selectedNumber = document.getElementById('colorClassesNo').value
                                colorParams.numClasses = selectedNumber
                                    // when the promise resolves, apply the renderer to the layer
                                colorRendererCreator.createClassBreaksRenderer(colorParams)
                                    .then(function(response) {

                                        selectedLayer.renderer = response.renderer
                                    })
                            })
                        }



                        /////////============ Size Renderer ================////////////////////
                        // Listen to change for Symbol style selector in Size Renderer
                        if (document.getElementById('sizeRendererSymbol')) {
                            document.getElementById('sizeRendererSymbol').addEventListener('change', (event) => {
                                var tempRenderer = selectedLayer.renderer.clone()
                                let selectedSymbol = document.getElementById('sizeRendererSymbol').selectedOptions[0].value
                                    //tempRenderer.defaultSymbol.style = selectedSymbol
                                var tempClassBreakInfos = tempRenderer.classBreakInfos
                                tempClassBreakInfos.forEach(alterClassBreakInfos)

                                function alterClassBreakInfos(item, index) {
                                    tempClassBreakInfos[index].symbol.style = selectedSymbol
                                }
                                tempRenderer.classBreakInfos = tempClassBreakInfos
                                selectedLayer.renderer = tempRenderer
                            })
                        }




                        // Listen to change for classificationMethod in size Renderer
                        if (document.getElementById('sizeClassificationMethods')) {
                            document.getElementById('sizeClassificationMethods').addEventListener('change', (event) => {
                                let selectedMethod = document.getElementById('sizeClassificationMethods').selectedOptions[0].value
                                sizeParams.classificationMethod = selectedMethod
                                    // when the promise resolves, apply the renderer to the layer
                                sizeRendererCreator.createClassBreaksRenderer(sizeParams)
                                    .then(function(response) {

                                        selectedLayer.renderer = response.renderer;


                                    });
                            })
                        }



                        // Listen to change in number of classes
                        if (document.getElementById('sizeClassesNo')) {
                            document.getElementById('sizeClassesNo').addEventListener('change', (event) => {
                                let selectedNumber = document.getElementById('sizeClassesNo').value
                                sizeParams.numClasses = selectedNumber
                                    // when the promise resolves, apply the renderer to the layer
                                sizeRendererCreator.createClassBreaksRenderer(sizeParams)
                                    .then(function(response) {

                                        selectedLayer.renderer = response.renderer
                                    })
                            })
                        }




                        /////////============ Heatmap ================////////////////////
                        // Listen to change in number of classes
                        if (document.getElementById('heatmapSelect')) {
                            document.getElementById('heatmapSelect').addEventListener('change', (event) => {
                                let selectedScheme = document.getElementById('heatmapSelect').selectedOptions[0].value
                                heatmapParams.heatmapScheme = heatmapSchemes.getSchemeByName({
                                    basemap: mapsList[activeMap].basemap,
                                    name: selectedScheme
                                });
                                // when the promise resolves, apply the renderer to the layer
                                heatmapRendererCreator.createRenderer(heatmapParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    });
                            })
                        }





                        /////////============ Unique Values | Type ================////////////////////
                        // Listen to change in number of classes

                        if (document.getElementById('sortingMethod')) {
                            document.getElementById('sortingMethod').addEventListener('change', (event) => {
                                let selectedMethod = document.getElementById('sortingMethod').selectedOptions[0].value
                                typeParams.sortBy = selectedMethod


                                // when the promise resolves, apply the renderer to the layer
                                typeRendererCreator.createRenderer(typeParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    });



                            })
                        }

                        if (document.getElementById('allTypesSwitch')) {
                            document.getElementById('allTypesSwitch').addEventListener('change', (event) => {
                                let showAllTypes = document.getElementById('allTypesSwitch').children[0]
                                    //console.log(showAllTypes.checked)
                                if (showAllTypes.checked)
                                    typeParams.numTypes = -1
                                else
                                    typeParams.numTypes = 10

                                // when the promise resolves, apply the renderer to the layer
                                typeRendererCreator.createRenderer(typeParams)
                                    .then(function(response) {
                                        selectedLayer.renderer = response.renderer;
                                    });

                            })
                        }

                        /////////============ General Settings  ================////////////////////
                        // Listen to change in 'Show Layer in Legend' toggle

                        function layerLegendSwitch(switchId) {
                            document.getElementById(switchId).addEventListener('change', (event) => {
                                const showInLegendToggle = document.getElementById(switchId).children[0]
                                if (showInLegendToggle.checked)
                                    selectedLayer.legendEnabled = true;
                                else
                                    selectedLayer.legendEnabled = false;

                            });
                        }

                        let uploadedDataManagerC = document.getElementsByClassName("uploadedDataManager")
                            //console.log(uploadedDataManagerC)
                            //uploadedDataManagerC.style.maxHeight = uploadedDataManagerC.scrollHeight + "px"
                            //uploadedDataManagerC[0].style.maxHeight = "600px"
                        uploadedDataManagerC[0].style.minHeight = "100%"
                        uploadedDataManagerC[0].style.height = "auto"
                            //console.log(uploadedDataManagerC[0].style)


                    } // customizeRenderer



                } /// activateSymbologyListeners




                //============================================================
                //==================== Popup templates ===============================================================================================================================================================
                //============================================================



                //============================================================
                //==================== Labels ===============================================================================================================================================================
                //============================================================
                let labelField, labelFont, labelColor, labelHaloColor, clonedLabelClass, labelPrefix = "",
                    labelSuffix = "";
                const labelingWidget = document.getElementById('labelingWidgetTemplate').cloneNode(true);
                let LabelToggleBtn = document.getElementById('LabelToggleBtn');
                labelingWidget.id = "labelingWidget";


                //let layerFieldsList = document.getElementById('labelingFields');
                //            layerFieldsList.id = "layerFieldsList";
                function setLabelExpression() {
                    switch (selectedLayer.type) {
                        case 'csv':
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].labelExpressionInfo.expression = "$feature." + document.getElementById('labelingFields').value;

                            break;
                        case 'feature':
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].labelExpression = document.getElementById('labelPrefix').value + " [" + document.getElementById('labelingFields').value + "] " + document.getElementById('labelSuffix').value;

                            break;

                        default:


                    }
                }

                function activateLabelingListeners(selectedLayer) {
                    switch (selectedLayer.type) {
                        case 'csv':
                            document.getElementById('labelPreSuffText').style.display = "none";
                            break;
                        case 'feature':
                            document.getElementById('labelPreSuffText').style.display = "flex";
                            break;

                        default:


                    }

                    document.getElementById('fontSizeSlider').innerHTML = "";
                    document.getElementById('haloSizeSlider').innerHTML = "";
                    const fontSizeSlider = new Slider({
                        container: "fontSizeSlider",
                        min: 6,
                        max: 40,
                        values: [10],
                        steps: 1,
                        snapOnClickEnabled: false,
                        visibleElements: {
                            labels: true,
                            rangeLabels: true
                        }
                    })

                    const haloSizeSlider = new Slider({
                        container: "haloSizeSlider",
                        min: 0,
                        max: 8,
                        values: [1],
                        steps: 1,
                        snapOnClickEnabled: false,
                        visibleElements: {
                            labels: true,
                            rangeLabels: true
                        }
                    })


                    if (mapsList[activeMap].layers.items[layerIndex].labelingInfo) {
                        //console.log("exist")
                        // Getting label parameters from each layer
                        // Input color only accept # hex format

                        function componentToHex(c) {
                            var hex = c.toString(16);
                            return hex.length == 1 ? "0" + hex : hex;
                        }

                        function rgbToHex(r, g, b) {
                            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
                        }

                        let hexColor = rgbToHex(mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.color.r,
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.color.g,
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.color.b);

                        let hexHaloColor = rgbToHex(mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.haloColor.r,
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.haloColor.g,
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.haloColor.b);


                        clonedLabelClass = mapsList[activeMap].layers.items[layerIndex].labelingInfo[0];
                        document.getElementById('labelingColors').value = hexColor;
                        document.getElementById('labelHaloColors').value = hexHaloColor;
                        fontSizeSlider.values[0] = mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.font.size;
                        haloSizeSlider.values[0] = mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.haloSize;
                    } else {
                        //console.log("doesn't exist")
                        document.getElementById('LabelToggleBtn').checked = false;
                        clonedLabelClass = labelClass.clone();
                        mapsList[activeMap].layers.items[layerIndex].labelingInfo = [clonedLabelClass];
                        //console.log(mapsList[activeMap].layers.items[layerIndex].labelingInfo[0]);
                    }

                    document.getElementById('labelingFields').addEventListener('change', (event) => {

                        setLabelExpression();
                        document.getElementById('LabelToggleBtn').checked = true;
                        mapsList[activeMap].layers.items[layerIndex].labelsVisible = true;
                    });

                    document.getElementById('labelPrefix').oninput = function() {
                        setLabelExpression();
                        //mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].labelExpression = document.getElementById('labelPrefix').value + "[" + document.getElementById('labelingFields').value + "] " + document.getElementById('labelSuffix').value;

                    };

                    document.getElementById('labelSuffix').oninput = function() {
                        setLabelExpression();
                        //mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].labelExpression = document.getElementById('labelPrefix').value + "[" + document.getElementById('labelingFields').value + "] " + document.getElementById('labelSuffix').value;

                    };

                    document.getElementById('LabelToggleBtn').addEventListener('change', (event) => {
                        //selectedLayer.labelingInfo = [labelClass];
                        if (document.getElementById('LabelToggleBtn').checked) {
                            mapsList[activeMap].layers.items[layerIndex].labelingInfo = [clonedLabelClass];
                            mapsList[activeMap].layers.items[layerIndex].labelsVisible = true;

                        } else {
                            mapsList[activeMap].layers.items[layerIndex].labelsVisible = false;

                        }

                        checkLabelVisibility();
                    });

                    let labelingColors = document.getElementById('labelingColors');
                    labelingColors.oninput = function() {
                        labelColor = document.getElementById('labelingColors').value;
                        mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.color = labelColor;
                    }

                    let labelHaloColors = document.getElementById('labelHaloColors');
                    labelHaloColors.oninput = function() {
                        labelHaloColor = document.getElementById('labelHaloColors').value;
                        mapsList[activeMap].layers.items[layerIndex].labelingInfo[0].symbol.haloColor = labelHaloColor;
                    }


                    fontSizeSlider.on("thumb-drag", function() {
                        let labelClone = mapsList[activeMap].layers.items[layerIndex].labelingInfo[0]
                        labelClone.symbol.font.size = fontSizeSlider.values[0]
                        mapsList[activeMap].layers.items[layerIndex].labelingInfo[0] = labelClone
                    })


                    haloSizeSlider.on("thumb-drag", function() {
                        let labelClone = mapsList[activeMap].layers.items[layerIndex].labelingInfo[0]
                        labelClone.symbol.haloSize = haloSizeSlider.values[0]
                        mapsList[activeMap].layers.items[layerIndex].labelingInfo[0] = labelClone
                    })





                } //activateLabelingListeners







                let labelClass = new LabelClass({
                    labelExpressionInfo: {
                        expression: ""
                    },
                    symbol: {
                        type: "text", // autocasts as new TextSymbol()
                        color: "black",
                        haloSize: 1,
                        haloColor: "white",
                        font: { // autocast as new Font()
                            family: "Arial",
                            size: 8,
                            weight: "normal"
                        }
                    },
                    //labelPlacement: "above-right",
                });



                //============================================================
                //==================== Popup ===============================================================================================================================================================
                //============================================================

                const popupConfigWidget = document.getElementById('popupConfigWidgetTemplate').cloneNode(true);
                let popupToggleBtn = document.getElementById('popupToggleBtn');
                popupConfigWidget.id = "popupConfigWidget";

                function activatePopupListeners(selectedLayer) {
                    if (selectedLayer.popupTemplate) {
                        if (selectedLayer.popupEnabled)
                            document.getElementById('popupToggleBtn').checked = true;
                        else
                            document.getElementById('popupToggleBtn').checked = false;
                    } else {
                        document.getElementById('popupToggleBtn').checked = false;
                    }

                    document.getElementById('popupToggleBtn').addEventListener('change', (event) => {
                        //selectedLayer.labelingInfo = [labelClass];
                        if (document.getElementById('popupToggleBtn').checked) {
                            mapsList[activeMap].layers.items[layerIndex].popupEnabled = true;

                            let fieldInfos = [];
                            if (selectedLayer.fields !== undefined) {
                                selectedLayer.fields.forEach(field => {
                                    let attrField = {
                                        fieldName: field.name
                                    }
                                    fieldInfos.push(attrField)
                                })
                                let selectedLayerPopup = {
                                    title: "العنصر رقم {" + selectedLayer.fields[0].name + "}",
                                    content: [{
                                        type: "fields", // Autocasts as new FieldsContent()
                                        // Autocasts as new FieldInfo[]
                                        fieldInfos: fieldInfos
                                    }]
                                }

                                mapsList[activeMap].layers.items[layerIndex].popupTemplate = selectedLayerPopup;
                            }



                        } else {
                            mapsList[activeMap].layers.items[layerIndex].popupEnabled = false;
                        }
                    });

                }


                //============================================================
                //==================== Layer List ===================================================================================================================================================================
                //============================================================
                const layerList = new LayerList({
                    view: view,
                    container: document.getElementById("layerList"),
                    selectionEnabled: true,
                    multipleSelectionEnabled: true,
                    listItemCreatedFunction: function(event) {
                        const item = event.item;


                        item.panel = {
                            content: "legend",
                            open: false,
                            visible: true,
                        };


                        item.actionsSections = [
                            [{
                                    //title: "Go to full extent",
                                    title: "عرض كامل البيانات",
                                    className: "esri-icon-zoom-out-fixed",
                                    id: "full-extent"
                                },
                                {
                                    //title: "Layer information",
                                    title: "معلومات الطبقة",
                                    className: "esri-icon-description",
                                    id: "information"
                                },
                                {
                                    //title: "Attribute Table",
                                    title: "البيانات الوصفية",
                                    className: "esri-icon-table",
                                    id: "attribute-table"
                                },
                                {
                                    //title: "Attribute Table",
                                    title: "استخراج البيانات",
                                    className: "esri-icon-download",
                                    id: "export-data"
                                },
                            ],
                            [{
                                    //title: "Symbology",
                                    title: "التمثيل",
                                    className: "esri-icon-maps",
                                    id: "symbology"
                                },
                                {
                                    //title: "labeling",
                                    title: "النصوص",
                                    className: "esri-icon-labels",
                                    id: "labeling"
                                },
                                {
                                    //title: "Popup Window",
                                    title: "النافذة المنبثقة",
                                    className: "esri-icon-configure-popup",
                                    id: "popup"
                                },

                            ],
                            [{
                                    //title: "Move Up",
                                    title: "التحريك لأعلى",
                                    className: "esri-icon-up-arrow",
                                    id: "move-up"
                                },
                                {
                                    //title: "Move Down",
                                    title: "التحريك لأسفل",
                                    className: "esri-icon-down-arrow",
                                    id: "move-down"
                                },
                            ],
                            [{
                                //title: "Delete Layer",
                                title: "حذف الطبقة",
                                className: "esri-icon-close",
                                id: "delete-layer"
                            }, ],
                        ];

                        //}
                    }
                });


                document.getElementById("layerList").style.display = "none"
                    //view.ui.add(layerList, "top-right");



                layerList.on("trigger-action", function(event) {


                    let id = event.action.id;
                    selectedLayer = event.item.layer;
                    //console.log(selectedLayer.type)

                    if (id === "full-extent") {
                        // If the full-extent action is triggered then navigate
                        // to the full extent of the visible layer.
                        view.goTo(selectedLayer.fullExtent);
                    } else if (id === "information") {
                        // If the information action is triggered, then
                        // open the item details page of the service layer.
                        window.open(selectedLayer.url);

                    } else if (id === "symbology") {
                        //console.log(symbologyOptionsDiv.innerHTML)
                        //hideWidgetMenus("symbologyWidget")
                        if (selectedLayer.type === 'csv' ||
                            selectedLayer.type === 'feature' ||
                            selectedLayer.type === 'json' ||
                            selectedLayer.type === 'geojson' 
                        ) {
                            clearLeftWidgets();
                            view.ui.add(symbologyWidget, "top-left");
                            widgetNavigator("symbologyWidget", "symbologyOptionsDiv");
                            activateWidgetHeader();
                            getLayerIndex(selectedLayer.id);
                            updateFieldsList('symbologyFields');
                            updateFieldsTypes();
                            activateSymbologyListeners();
                        }


                    } else if (id === "attribute-table") {
                        if (selectedLayer.type === 'csv' ||
                            selectedLayer.type === 'feature' ||
                            selectedLayer.type === 'json' ||
                            selectedLayer.type === 'geojson'
                        ) {
                            let fieldConfigs = [];
                            document.getElementById("attributesTableDiv").innerHTML = "";
                            selectedLayer.fields.forEach(field => {
                                fieldConfigs.push({
                                    name: field.name,
                                    label: field.name,
                                    visible: true
                                })

                            });
                            const featureTable = new FeatureTable({
                                view: view, // The view property must be set for the select/highlight to work
                                layer: selectedLayer,
                                container: "attributesTableDiv",
                                fieldConfigs: fieldConfigs,
                                menuConfig: {
                                    items: [{
                                            label: "Close Table",
                                            iconClass: "esri-icon-close-circled",
                                            clickFunction: closeAttributeTable,
                                        }

                                    ]
                                }
                            });
                            clearLeftWidgets();
                            view.ui.empty("bottom-right");
                            view.ui.add(featureTable, "bottom-left");

                            function closeAttributeTable() {
                                featureTable.menu.open = false;
                                view.ui.remove(featureTable);
                            }
                        }
                    } else if (id === "export-data") {
                        //console.log(symbologyOptionsDiv.innerHTML)
                        //hideWidgetMenus("symbologyWidget")
                        if (selectedLayer.type === 'csv' ||
                            selectedLayer.type === 'feature' ||
                            selectedLayer.type === 'json' ||
                            selectedLayer.type === 'geojson' 
                        ) {
                            clearLeftWidgets();
                            view.ui.add(exportDataWidget, "top-left");
                            activateWidgetHeader();
                            getLayerIndex(selectedLayer.id);
                            activateExportingListeners();
                        }




                    } else if (id === "labeling") {
                        if (selectedLayer.type === 'csv' ||
                            selectedLayer.type === 'feature' ||
                            selectedLayer.type === 'json' ||
                            selectedLayer.type === 'geojson' 
                        ) {
                            clearLeftWidgets();
                            view.ui.add(labelingWidget, "top-left");
                            activateWidgetHeader();
                            getLayerIndex(selectedLayer.id);
                            updateFieldsList('labelingFields');
                            activateLabelingListeners(selectedLayer);
                        }



                    } else if (id === "popup") {
                        if (selectedLayer.type === 'csv' ||
                            selectedLayer.type === 'feature' ||
                            selectedLayer.type === 'json' ||
                            selectedLayer.type === 'geojson' 
                        ) {
                            clearLeftWidgets();
                            view.ui.add(popupConfigWidget, "top-left");
                            activateWidgetHeader();
                            getLayerIndex(selectedLayer.id);
                            activatePopupListeners(selectedLayer);
                        }


                    } else if (id === "move-up") {
                        //console.log(selectedLayer)
                        getLayerIndex(selectedLayer.id);
                        moveLayerUp(selectedLayer);
                        fixLayerListUI();

                    } else if (id === "move-down") {
                        //console.log(selectedLayer)
                        getLayerIndex(selectedLayer.id);
                        moveLayerDown(selectedLayer);
                        fixLayerListUI();

                    } else if (id === "delete-layer") {
                        //console.log(selectedLayer)
                        mapsList[activeMap].remove(selectedLayer)
                    }
                });


                function getLayerIndex(id) {
                    let layers = mapsList[activeMap].layers.items;
                    layers.forEach(matchID);

                    function matchID(layer, index) {
                        if (id === layer.id) {
                            layerIndex = index;
                            //console.log(layerIndex)
                        }

                    }
                }

                function moveLayerUp(layer) {
                    let maxIndex = mapsList[activeMap].layers.length;
                    if (layerIndex < maxIndex) {
                        mapsList[activeMap].reorder(layer, (layerIndex + 1))
                    }
                }

                function moveLayerDown(layer) {
                    if (layerIndex > 0) {
                        mapsList[activeMap].reorder(layer, (layerIndex - 1))
                    }
                }

                function updateFieldsList(SelectElementID) {
                    document.getElementById(SelectElementID).innerHTML = "";
                    var option = document.createElement("option")
                    option.value = ""
                    option.text = "اختر"
                    document.getElementById(SelectElementID).appendChild(option)
                    selectedLayer.fields.forEach(field => {
                        var option = document.createElement("option")
                        option.value = field.name
                        option.text = field.name
                        document.getElementById(SelectElementID).appendChild(option)
                    })
                }

                function checkLabelVisibility() {
                    if (mapsList[activeMap].layers.items[layerIndex].labelsVisible) {
                        LabelToggleBtn.checked = true;

                    } else {
                        LabelToggleBtn.checked = false;
                    }
                } // checkLabelVisibility



                function defineEmptyLabel() {
                    if (mapsList[activeMap].layers.items[layerIndex].labelingInfo == null) {
                        mapsList[activeMap].layers.items[layerIndex].labelingInfo = labelClass;
                    }
                }


                function updateFieldsTypes() {
                    fieldsTypes = {};
                    let layerFields = mapsList[activeMap].layers.items[layerIndex].fields;
                    layerFields.forEach(field => {
                        let fieldName = field.name;
                        let fieldType = field.type;
                        fieldsTypes[fieldName] = fieldType
                    })
                }


                function symbologyLister(event) {

                    let symbologyField = document.getElementById('symbologyFields').value
                    let fieldType = fieldsTypes[symbologyField];
                    let textualRenderers, numericalRenderers;
                    switch (fieldType) {
                        // Internet
                        case 'string':


                            textualRenderers = {
                                none: "اختر نوع الترميز",
                                simple: "تمثيل بسيط",
                                unique: "تمثيل فريد"
                            }
                            addOptionsToSelector(textualRenderers, symbologySelector)

                            break;
                        case 'date':


                            textualRenderers = {
                                none: "اختر نوع الترميز",
                                simple: "تمثيل بسيط",
                                unique: "تمثيل فريد"
                            }
                            addOptionsToSelector(textualRenderers, symbologySelector)

                            break;

                        default:


                            numericalRenderers = {
                                none: "اختر نوع الترميز",
                                color: "تمثيل باللون",
                                size: "تمثيل بالحجم",
                                heatmap: "تمثيل حراري",
                                simple: "تمثيل بسيط",
                                unique: "تمثيل فريد"
                            }
                            addOptionsToSelector(numericalRenderers, symbologySelector)




                    }

                } // SymbologyLister end



                // This function adds options {optionValue:optionText} to Select element
                function addOptionsToSelector(optionsObj, selector) {
                    // First we remove all existing options
                    while (selector.firstChild) {
                        selector.removeChild(selector.firstChild)
                    }
                    for (const [key, value] of Object.entries(optionsObj)) {
                        //console.log(`${key}: ${value}`)
                        let option = document.createElement("option")
                        option.value = `${key}`
                        option.text = `${value}`
                        selector.appendChild(option)
                    }
                    return selector
                }




                function checkExistingConfig() {
                    if (symbologyOptionsDiv === undefined) {
                        symbologyOptionsDiv = document.getElementById('symbologyOptionsDiv').cloneNode(true);
                        symbologyWidget.innerHTML = "";
                        symbologyWidget.appendChild(widgetHeader);
                        symbologyWidget.appendChild(symbologyOptionsDiv);
                    }
                }


                function hideWidgetMenus(currentWidgetId) {
                    currentWidget = document.getElementById(currentWidgetId);
                    for (i = 1; i < currentWidget.children.length; i++) {
                        //if(currentWidget.children[i].id != "widgetHeader")
                        currentWidget.children[i].style.display = "none";
                    }
                }

                function widgetNavigator(currentWidgetId, nextMenuId) {
                    hideWidgetMenus(currentWidgetId);
                    document.getElementById(nextMenuId).style.display = "flex";
                }


                //============================================================
                //==================== Layers ===================================================================================================================================================================
                //============================================================




                //============================================================
                //==================== Bookmarks ========================================
                //============================================================
                let bookmarksWidget = document.getElementById('bookmarksWidgetTemplate').cloneNode(true);
                bookmarksWidget.id = "bookmarksWidget";
                let addBookmarkBtn = document.getElementById('addBookmarkBtn').cloneNode(true);
                addBookmarkBtn.id = "addBookmarkBtn";
                let deleteBookmarkBtn = document.getElementById('deleteBookmarkBtn').cloneNode(true);
                deleteBookmarkBtn.id = "deleteBookmarkBtn";

                let bookmarkName, savedBookmarks, storedBookmarks = {}
                if (localStorage.getItem('localBookmarks') !== null) {
                    storedBookmarks = JSON.parse(localStorage.getItem('localBookmarks'))


                }


                document.getElementById("bookmarkToggle").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(bookmarksWidget, "top-left");
                    activateWidgetHeader();

                    //update bookmark List
                    document.getElementById('bookmarksList').innerHTML = "";
                    for (let bookmark in storedBookmarks) {
                        let extent = storedBookmarks[bookmark];
                        let bookmarkDiv = document.createElement("div");
                        bookmarkDiv.class = "savedBookmark";
                        bookmarkDiv.innerHTML = bookmark;
                        document.getElementById('bookmarksList').appendChild(bookmarkDiv)
                    }

                    document.getElementById("addBookmarkBtn").addEventListener("click", function() {
                        widgetNavigator("bookmarksWidget", "addBookmarkDiv");



                        document.getElementById("saveBookmarkBtn").addEventListener("click", function() {
                            widgetNavigator("bookmarksWidget", "bookmarksDiv");
                            //console.log(document.getElementById("bookmarkName").value);
                            bookmarkName = document.getElementById("bookmarkName").value;
                            if (bookmarkName === "")
                                alert("الرجاء إدخال اسم النقطة المرجعية");
                            else {
                                document.getElementById("bookmarkName").value = ""
                                let currentExtent = view.extent
                                currentExtent.name = bookmarkName
                                storedBookmarks[bookmarkName] = currentExtent
                                    //console.log(JSON.stringify(storedBookmarks))


                                localStorage.setItem('localBookmarks', JSON.stringify(storedBookmarks))
                                    //storedBookmarks = JSON.parse(localStorage.getItem('localBookmarks'))

                                //console.log(storedBookmarks)
                                updateBookmarks();
                            }

                            //bkmarksContainer.style.height = bkmarksContainer.scrollHeight + 10 + "px"
                            activateBookmarksListener();


                        });


                    });


                    activateBookmarksListener();

                    document.getElementById("deleteBookmarkBtn").addEventListener("click", function() {
                        for (let i = 0; i < document.getElementById("bookmarksList").children.length; i++) {
                            document.getElementById("bookmarksList").children[i].style.background = "#E27878";

                            document.getElementById("bookmarksList").children[i].addEventListener('click', event => {
                                delete storedBookmarks[event.target.innerHTML];
                                updateBookmarks();

                                for (let i = 0; i < document.getElementById("bookmarksList").children.length; i++) {
                                    document.getElementById("bookmarksList").children[i].style.background = "#rgb(209, 217, 223)";
                                    activateBookmarksListener();
                                }


                            });

                        }



                    });

                });

                function goToBookmark(bookmark) {
                    //console.log(storedBookmarks[bookmark])
                    view.extent = storedBookmarks[bookmark]
                }


                function activateBookmarksListener() {
                    for (let i = 0; i < document.getElementById("bookmarksList").children.length; i++) {
                        document.getElementById("bookmarksList").children[i].addEventListener('click', event => {
                            //console.log(event.target.innerHTML)
                            goToBookmark(event.target.innerHTML);
                        });

                    }

                }

                function updateBookmarks() {
                    document.getElementById('bookmarksList').innerHTML = "";
                    localStorage.setItem('localBookmarks', JSON.stringify(storedBookmarks));
                    for (let bookmark in storedBookmarks) {
                        let extent = storedBookmarks[bookmark];
                        let bookmarkDiv = document.createElement("div");
                        bookmarkDiv.class = "savedBookmark";
                        bookmarkDiv.innerHTML = bookmark;
                        document.getElementById('bookmarksList').appendChild(bookmarkDiv)
                    }
                }




                //============================================================
                //==================== Reset Interface ========================================
                //============================================================
                function resetInterfaceListener() {
                    document.getElementById("resetInterface").addEventListener("click", function() {
                        let accordions = document.getElementsByClassName("panel");
                        for (i = 0; i < accordions.length; i++) {
                            //console.log(accordions[i].children)
                            //expandMenu(0)
                            fixLayerListUI()
                            accordions[i].style.maxHeight = "0";

                            view.ui.empty("top-left");
                            view.ui.empty("bottom-left");
                            view.ui.empty("top-right");
                            view.ui.empty("bottom-right");

                            view.ui.add(zoom, "top-right");
                        }
                    });
                }


                //============================================================
                //==================== Info ========================================
                //============================================================
                function AppInfoWidgetListener() {
                    document.getElementById("appInfo").addEventListener("click", function() {
                        let appInfoWidget = document.getElementById('appInfoWidgetTemplate').cloneNode(true);
                        appInfoWidget.id = "appInfoWidget";
                        clearLeftWidgets();
                        view.ui.add(appInfoWidget, "top-left");
                        activateWidgetHeader();
                    });
                }

                //============================================================
                //==================== Editor Toggle  ========================================
                //============================================================

                function editorToggleListener() {
                    document.getElementById("editorToggle").addEventListener("click", function() {
                        if (document.getElementById("editorToggleInput").checked) {
                            document.getElementById("editorToggleInput").checked = false;
                            view.ui.remove(editor)
                        } else {
                            document.getElementById("editorToggleInput").checked = true;
                            view.ui.add(editor, "top-right");
                        }

                    });
                }

                //============================================================
                //==================== Print Toggle  ========================================
                //============================================================

                function printToggleListener() {
                    document.getElementById("printToggle").addEventListener("click", function() {
                        clearLeftWidgets();
                        view.ui.add(printerWidget, "top-left");
                    });
                }


                //============================================================
                //==================== clear Screen ========================================
                //============================================================

                document.getElementById("clearScreen").addEventListener("click", function() {
                    view.graphics.removeAll();
                    layerList.operationalItems.items.forEach(layer => {
                        layer.visible = false;
                    });

                });





                //============================================================
                //==================== Dataframes ========================================
                //============================================================
                let dataframeName;
                let accordion = document.getElementsByClassName("panel5");
                let dataframesList = document.getElementById("dataframesList");
                for (let dataframe in mapsList) {
                    let dataframeDiv = document.createElement("div");
                    dataframeDiv.innerHTML = dataframe;
                    document.getElementById('dataframesList').appendChild(dataframeDiv)
                }
                //let deleteBookmarkBtn = document.getElementById('deleteBookmarkBtn').cloneNode(true);
                //deleteBookmarkBtn.id = "deleteBookmarkBtn";
                for (let i = 0; i < document.getElementById("dataframesList").children.length; i++) {
                    if (document.getElementById("dataframesList").children[i].innerHTML === activeMap)
                        document.getElementById("dataframesList").children[i].style.background = "#76E284";
                }

                document.getElementById("adddataframeBtn").addEventListener("click", function() {
                    document.getElementById("addDataframeDiv").style.display = "flex";
                    accordion[0].style.maxHeight = accordion[0].scrollHeight + "px";

                    document.getElementById("saveDataframeBtn").addEventListener("click", function() {

                        //console.log(document.getElementById("dataframeName").value);
                        dataframeName = document.getElementById("dataframeName").value;
                        if (dataframeName === "") {
                            alert("الرجاء إدخال اسم النقطة المرجعية");
                        } else {
                            document.getElementById("addDataframeDiv").style.display = "none";
                            //update dataframe List
                            document.getElementById("dataframesList").innerHTML = "";
                            extentsList[activeMap] = view.extent;
                            activeMap = dataframeName;
                            mapsList[activeMap] = new Map({
                                basemap: "streets" // topo, osm, streets... https://developers.arcgis.com/javascript/3/jsapi/esri.basemaps-amd.html or https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html
                            })
                            view.map = mapsList[activeMap];

                            for (let dataframe in mapsList) {
                                let dataframeDiv = document.createElement("div");
                                dataframeDiv.innerHTML = dataframe;
                                document.getElementById("dataframesList").appendChild(dataframeDiv)
                            }
                            for (let i = 0; i < document.getElementById("dataframesList").children.length; i++) {
                                if (document.getElementById("dataframesList").children[i].innerHTML === activeMap)
                                    document.getElementById("dataframesList").children[i].style.background = "#76E284";
                            }

                            accordion[0].style.maxHeight = accordion[0].scrollHeight + "px";
                            document.getElementById("dataframeName").value = "";

                        }

                        activatedataframesListener()
                    });


                });

                function activatedataframesListener() {
                    for (let i = 0; i < document.getElementById("dataframesList").children.length; i++) {
                        document.getElementById("dataframesList").children[i].addEventListener("click", function() {
                            extentsList[activeMap] = view.extent;
                            activeMap = event.target.innerHTML;
                            view.map = mapsList[activeMap];
                            view.extent = extentsList[activeMap];
                            for (let i = 0; i < document.getElementById("dataframesList").children.length; i++) {
                                document.getElementById("dataframesList").children[i].style.background = "rgb(209, 217, 223)";
                                if (document.getElementById("dataframesList").children[i].innerHTML === activeMap)
                                    document.getElementById("dataframesList").children[i].style.background = "#76E284";
                            }
                        });

                    }

                }


                document.getElementById("deletedataframeBtn").addEventListener("click", function() {
                    for (let i = 0; i < document.getElementById("dataframesList").children.length; i++) {
                        if (document.getElementById("dataframesList").children[i].innerHTML !== "الخريطة الافتراضية")
                            document.getElementById("dataframesList").children[i].style.background = "#E27878";

                        document.getElementById("dataframesList").children[i].addEventListener('click', event => {
                            if (document.getElementById("dataframesList").children[i].innerHTML === "الخريطة الافتراضية")
                                document.getElementById("dataframesList").children[i].removeEventListener("click", event)
                            else {
                                mapsList[event.target.innerHTML] = '';
                                extentsList[event.target.innerHTML] = '';

                                if (event.target.innerHTML === activeMap) {
                                    activeMap = "الخريطة الافتراضية";
                                    view.map = mapsList[activeMap];
                                    view.extent = extentsList[activeMap];
                                }

                            }
                            updatedataframes();
                            for (let i = 0; i < document.getElementById("dataframesList").children.length; i++) {
                                document.getElementById("dataframesList").children[i].style.background = "#rgb(209, 217, 223)";
                                if (document.getElementById("dataframesList").children[i].innerHTML === activeMap)
                                    document.getElementById("dataframesList").children[i].style.background = "#76E284";
                            }

                            activatedataframesListener();

                        });

                    }

                });

                function updatedataframes() {
                    document.getElementById('dataframesList').innerHTML = "";
                    for (let dataframe in mapsList) {
                        let dataframeDiv = document.createElement("div");
                        dataframeDiv.innerHTML = dataframe;
                        document.getElementById("dataframesList").appendChild(dataframeDiv)
                    }
                }


                //============================================================
                //==================== Query ========================================
                //============================================================

                let selectedLayerFeatures, queryField, sqlExpression;
                let querySymbol, queryRenderer, querySource, queryResult, queryLayerName, selectedLayerName,
                    queryLayer = new FeatureLayer({
                        title: "نتيجة البحث",
                        source: [],
                        fields: [],
                        spatialReference: view.spatialReference,
                    });

                document.getElementById("queryLayers").addEventListener("change", function() {
                    if (this.value != "") {
                        document.getElementById("downloadQueryBtn").disabled = true;
                        document.getElementById("downloadQueryBtn").style.background = "gray";
                        selectedLayerName = this.value;
                        selectedLayer = mapsList[activeMap].findLayerById(selectedLayerName);
                        selectedLayer.labelingInfo = [labelClass];
                        queryLayerName = selectedLayer.title + "_Query";

                        if (selectedLayer.type === 'csv' ||
                            selectedLayer.type === 'feature' ||
                            selectedLayer.type === 'json' ||
                            selectedLayer.type === 'geojson' ) {
                            updateFieldsList("queryFields");

                            var layerFieldsQuery = {
                                outFields: ["*"],
                                returnGeometry: false,
                                where: ""
                            };
                            selectedLayer.queryFeatures(layerFieldsQuery).then(function(result) {
                                selectedLayerFeatures = result.features;
                            });
                        } else {
                            alert("لا يمكن إجراء البحث على هذه الطبقة");
                            document.getElementById("queryLayers").value = "";
                        }

                    }
                });

                document.getElementById("queryFields").addEventListener("change", function() {
                    updateQueryValues();

                });

                document.getElementById("queryInputType").addEventListener("change", function() {
                    switch (this.value) {
                        case 'existing':
                            document.getElementById("queryValuesDiv").style.display = "block";
                            document.getElementById("queryInputDiv").style.display = "none";

                            updateQueryValues();
                            var accordion = document.getElementsByClassName("panel2");
                            accordion[0].style.maxHeight = accordion[0].scrollHeight + "px";


                            break;

                        case 'inputs':
                            document.getElementById("queryInputDiv").style.display = "block";
                            document.getElementById("queryValuesDiv").style.display = "none";
                            var accordion = document.getElementsByClassName("panel2");
                            accordion[0].style.maxHeight = accordion[0].scrollHeight + "px";
                            break;

                        default:
                            break;
                    }
                });


                document.getElementById("applyQueryBtn").addEventListener("click", function() {
                    queryField = document.getElementById("queryFields").value;
                    let queryLayers = document.getElementById("queryLayers").value;
                    let queryOperator = document.getElementById("queryOperators").value;
                    let queryInputType = document.getElementById("queryInputType").value;
                    let queryInput = document.getElementById("queryInput").value;
                    let queryValue = document.getElementById("queryValues").value;

                    let selectionSource = [];
                    queryLayer.source = [];
                    queryLayer.fields = selectedLayer.fields;
                    queryLayer.geometryType = selectedLayer.geometryType;
                    queryLayer.spatialReference = selectedLayer.spatialReference;
                    mapsList[activeMap].remove(queryLayer);


                    if (
                        queryLayers === "" ||
                        queryOperator === "" ||
                        queryField === "" ||
                        queryInputType === ""
                    ) {
                        alert("الرجاء تكملة متطلبات البحث")
                    } else {
                        if (!Number(queryValue))
                            queryValue = "'" + queryValue + "'"
                        if (queryInputType === "existing")
                            sqlExpression = queryField + queryOperator + queryValue
                        else if (queryInputType === "inputs")
                            sqlExpression = queryField + queryOperator + queryInput
                        let attributeQuery = {
                            outFields: ["*"],
                            returnGeometry: true,
                            where: sqlExpression
                        };
                        selectedLayer.queryFeatures(attributeQuery).then(function(response) {
                            if (response.features.length > 0) {
                                addQueryResult(response)

                                queryResult = JSON.stringify(response);
                                //console.log(queryResult)

                            } // if response
                            else {
                                alert("لا توجد نتيجة لهذا البحث")
                            }
                        });


                    }
                });



                function updateQueryValues() {
                    queryField = document.getElementById("queryFields").value;
                    document.getElementById("queryValues").innerHTML = "";
                    for (i = 0; i < selectedLayerFeatures.length; i++) {
                        let option = document.createElement("option");
                        option.value = selectedLayerFeatures[i].attributes[queryField];
                        option.text = selectedLayerFeatures[i].attributes[queryField];
                        document.getElementById("queryValues").appendChild(option)
                    }

                }



                function addQueryResult(response) {
                    querySource = [];
                    layerList.operationalItems.items.forEach(layer => {
                        if (layer.layer.id === selectedLayer.id)
                            layer.visible = false;
                        //console.log(layer)
                    });



                    let geometriesArray = response.features.map(function(feature) {
                        return feature.geometry
                    })

                    const markerSymbol = {
                        type: "simple-marker",
                        style: "circle", // circle,cross,diamond
                        color: "#C6115A",
                        size: "8px", // pixels
                    }
                    const lineSymbol = {
                        type: "simple-line",
                        color: "#C6115A",
                        width: 4
                    }

                    const fillSymbol = {
                        type: "simple-fill",
                        color: "#C6115A",
                        width: "3px",

                    }

                    switch (response.geometryType) {
                        case 'point':
                            querySymbol = markerSymbol;
                            break;
                        case 'polyline':
                            querySymbol = lineSymbol;
                            break;
                        case 'polygon':
                            querySymbol = fillSymbol;
                            break;
                        default:
                            break;

                    }
                    queryRenderer = {
                        type: "simple",
                        symbol: querySymbol
                    };

                    response.features.forEach(feature => {
                        let queryGraphic = new Graphic({
                            geometry: feature.geometry,
                            attributes: feature.attributes,
                            symbol: querySymbol
                        });
                        //view.graphics.add(queryGraphic) //temp
                        querySource.push(queryGraphic)
                    });


                    queryLayer.renderer = queryRenderer;
                    queryLayer.source = querySource;
                    mapsList[activeMap].add(queryLayer)
                    legend.layerInfos.push({
                        layer: queryLayer,
                    });
                    queryLayer.queryExtent().then(function(result) {
                            view.goTo(result.extent)
                            document.getElementById('queryLayers').value = selectedLayerName;
                        })
                        //console.log(queryLayer)

                    if (geometriesArray[0].type === "point") {
                        var featuresTable = []

                        var resultFeatures = response.features
                        resultFeatures.forEach(featureTotable)

                        function featureTotable(feature) {
                            //console.log(feature.attributes)
                            featuresTable.push(feature.attributes)
                        }
                        //console.table(featuresTable)
                        /*var stringify = JSON.stringify(featuresTable)
                        console.log(stringify)*/

                        const Querycsv = $.csv.fromObjects(featuresTable)
                            // Download csv file
                            //if (featuresTable.length > 0) downloadBlobAsFile(csv, 'streetsTable.csv')

                        var downloadQueryBtn = document.getElementById("downloadQueryBtn");
                        if (featuresTable.length > 0) {
                            downloadQueryBtn.disabled = false;
                            downloadQueryBtn.style.background = "green";
                        }


                        downloadQueryBtn.addEventListener('click', (event) => {
                            downloadBlobAsFile(Querycsv, queryLayerName)
                        });

                    } else {
                        var downloadQueryBtn = document.getElementById("downloadQueryBtn");
                        downloadQueryBtn.disabled = false;
                        downloadQueryBtn.style.background = "green";

                        downloadQueryBtn.addEventListener('click', (event) => {
                            downloadBlobAsFile(queryResult, queryLayerName + ".json")
                        });
                    }



                } //addQueryResult


                document.getElementById("resetQuery").addEventListener('click', (event) => {
                    if (selectedLayer != undefined) {
                        mapsList[activeMap].remove(queryLayer);
                        layerList.operationalItems.items.forEach(layer => {
                            if (layer.layer.id === selectedLayer.id)
                                layer.visible = true;

                        });
                        selectedLayer.queryExtent().then(function(result) {
                            view.goTo(result.extent)
                        })
                    }
                });




                //============================================================
                //==================== Analysis ========================================
                //============================================================



                //==================== spatialReference ========================================

                let targetCRS, coordsysType, NorthSouth = "N",
                    utmZone = 1;


                document.getElementById("crsType").addEventListener("change", function() {
                    coordsysType = this.value;
                    if (coordsysType === "utm") {
                        //document.getElementById("NorSDiv").style.display = "flex";
                        //document.getElementById("utmZoneDiv").style.display = "flex";
                        document.getElementById("NorS").addEventListener("change", function() {
                            NorthSouth = this.value;
                        });
                        for (i = 1; i <= 60; i++) {
                            let option = document.createElement("option")
                            option.value = i
                            option.text = i
                            document.getElementById("utmZone").appendChild(option)
                        }
                        document.getElementById("utmZone").addEventListener("change", function() {
                            utmZone = this.value;
                        });

                    }

                });
                document.getElementById("changeCRS").addEventListener("click", function() {
                    if (coordsysType === "utm") {
                        targetCRS = view.spatialReference.clone();
                        targetCRS.wkid = 3857;
                        view.spatialReference = targetCRS;
                    } else {
                        targetCRS = view.spatialReference.clone();
                        targetCRS.wkid = 4326;
                        view.spatialReference = targetCRS;
                    }

                });



                //==================== Selection ========================================

                let selectionWidget = document.getElementById('selectionWidgetTemplate').cloneNode(true);

                let targetLayer, selectionLayer, selectionListener, selectSymbol, selectionRenderer, selectionSource,
                    selectedFeaturesLayer = new FeatureLayer({
                        title: "المعالم المحددة",
                        source: [],
                        fields: [],
                        /*geometryType: "point",
                        renderer: {
                            type: "simple",
                            symbol: {},
                        },
                        spatialReference: view.spatialReference,*/
                    });

                document.getElementById("selectToggle").addEventListener("click", activateSelectionTools);
                document.getElementById("selectFeaturesBtn").addEventListener("click", activateSelectionTools);

                function activateSelectionTools() {
                    clearLeftWidgets();
                    view.ui.add(selectionWidget, "top-left");
                    activateWidgetHeader();
                    upadateLayerList("targetSelectionLayer");
                    upadateLayerList("selectionLayers");

                    document.getElementById("targetSelectionLayer").addEventListener("change", function() {
                        if (document.getElementById("targetSelectionLayer").value !== "") {
                            let targetSelectionLayerID = document.getElementById("targetSelectionLayer").value;
                            targetLayer = mapsList[activeMap].findLayerById(targetSelectionLayerID);
                            document.getElementById("selectionLayers").options[0].selected = true;
                            selectedFeaturesLayer.fields = targetLayer.fields;
                            selectedFeaturesLayer.geometryType = targetLayer.geometryType;
                            selectedFeaturesLayer.spatialReference = targetLayer.spatialReference;
                            let inputGeom = targetLayer.geometryType;
                            switch (inputGeom) {
                                case "point":
                                    selectSymbol = selectedPointsSymbol;
                                    break;
                                case "polyline":
                                    selectSymbol = selectedLinesSymbol;
                                    break;
                                default:
                                    selectSymbol = selectedPolygonsSymbol;
                                    break;
                            }
                            selectionRenderer = {
                                type: "simple",
                                symbol: selectSymbol
                            };

                        }
                        if (selectionListener)
                            selectionListener.remove();


                    });

                    document.getElementById("selectionLayers").addEventListener("change", function() {
                        if (document.getElementById("targetSelectionLayer").value === "") {
                            alert("الرجاء تحديد الطبقة المستهدفة!")
                        } else if (document.getElementById("selectionLayers").value !== "") {
                            let selectionLayerID = document.getElementById("selectionLayers").value;
                            selectionLayer = mapsList[activeMap].findLayerById(selectionLayerID);
                            if (selectionListener)
                                selectionListener.remove();

                            mapsList[activeMap].remove(selectedFeaturesLayer);
                            selectionSource = [];
                            selectedFeaturesLayer.source = [];

                            if (selectionLayer.type === "graphics") {
                                selectionLayer.graphics.items.forEach(queryFeature => {
                                    selectFeature(queryFeature);
                                });

                            } else {
                                var QueryAll = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectionLayer.queryFeatures(QueryAll).then(function(queryResult) {
                                    queryResult.features.forEach(queryFeature => {
                                        selectFeature(queryFeature);

                                    });

                                });
                            } // else not graphics
                        } //else if selectionLayers not empty
                    });

                    function selectFeature(queryFeature) {

                        var Query = {
                            outFields: ["*"],
                            returnGeometry: true,
                            geometry: queryFeature.geometry,
                        };

                        targetLayer.queryFeatures(Query).then(function(result) {
                            result.features.forEach(feature => {

                                let selectionGraphic = new Graphic({
                                    geometry: feature.geometry,
                                    attributes: feature.attributes,
                                    symbol: selectSymbol
                                });
                                //view.graphics.add(selectionGraphic)
                                selectionSource.push(selectionGraphic)
                            });

                            selectedFeaturesLayer.renderer = selectionRenderer;
                            selectedFeaturesLayer.source = selectionSource;
                            mapsList[activeMap].add(selectedFeaturesLayer)
                            legend.layerInfos.push({
                                layer: selectedFeaturesLayer,
                            });

                        });
                    } //selectFeature


                    document.getElementById("activateSelection").addEventListener("click", function() {
                        if (document.getElementById("targetSelectionLayer").value === "") {
                            alert("الرجاء تحديد الطبقة المستهدفة!")
                        } else {
                            selectionListener = view.on("click", function(event) {
                                let selectionSource = [];
                                selectedFeaturesLayer.source = [];
                                selectedFeaturesLayer.fields = targetLayer.fields;
                                selectedFeaturesLayer.geometryType = targetLayer.geometryType;
                                selectedFeaturesLayer.spatialReference = targetLayer.spatialReference;
                                mapsList[activeMap].remove(selectedFeaturesLayer);
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                    geometry: view.toMap(event),
                                };
                                /* search buffer radius 
                                if(targetLayer.geometryType ==='point')
                                Query.distance = "1"
                                */
                                targetLayer.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {

                                        let selectionGraphic = new Graphic({
                                            geometry: feature.geometry,
                                            attributes: feature.attributes,
                                            symbol: selectSymbol
                                        });
                                        //view.graphics.add(selectionGraphic)
                                        selectionSource.push(selectionGraphic)
                                    });

                                    selectedFeaturesLayer.renderer = selectionRenderer;
                                    selectedFeaturesLayer.source = selectionSource;
                                    mapsList[activeMap].add(selectedFeaturesLayer)
                                    legend.layerInfos.push({
                                        layer: selectedFeaturesLayer,
                                    });

                                });



                            });
                        } //else
                    }); //activateSelection addEventListener

                    document.getElementById("disableSelection").addEventListener("click", function() {
                        if (selectionListener)
                            selectionListener.remove()
                    });

                    document.getElementById("removeSelection").addEventListener("click", function() {
                        document.getElementById("selectionLayers").options[0].selected = true;
                        document.getElementById("targetSelectionLayer").options[0].selected = true;
                        if (selectionListener)
                            selectionListener.remove();
                        mapsList[activeMap].remove(selectedFeaturesLayer);

                    });

                } // activateSelectionTools 




                //==================== Buffer Analysis ========================================

                let bufferAnalysisWidget = document.getElementById('bufferAnalysisWidgetTemplate').cloneNode(true);

                document.getElementById("bufferAnalysisBtn").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(bufferAnalysisWidget, "top-left");
                    activateWidgetHeader();
                    upadateLayerList("bufferLayers");

                    document.getElementById("bufferLayers").addEventListener("change", function() {
                        if (document.getElementById("bufferLayers").value !== "") {
                            let bufferLayerID = document.getElementById("bufferLayers").value;
                            selectedLayer = mapsList[activeMap].findLayerById(bufferLayerID);
                            if (selectedLayer.type === "graphics") {
                                document.getElementById("bufferDistanceType").options[0].selected = true;
                                document.getElementById("bufferDistanceType").disabled = true;
                                document.getElementById("bufferDistanceField").disabled = true;
                            } else {
                                document.getElementById("bufferDistanceType").disabled = false;
                                updateFieldsList('bufferDistanceField');
                            }
                        }
                    });

                    document.getElementById("bufferDistanceType").addEventListener("change", function() {
                        if (document.getElementById("bufferDistanceType").value === "existing") {
                            document.getElementById("bufferDistanceField").disabled = false;
                        } else {
                            document.getElementById("bufferDistanceField").disabled = true;
                        }

                    });


                    document.getElementById("runBuffer").addEventListener("click", function() {
                        if (document.getElementById("bufferLayers").value === "")
                            alert("الرجاء اختيار طبقة");
                        else if (document.getElementById("bufferDistance").value === "" && document.getElementById("bufferDistanceType").value === "inputs")
                            alert("الرجاء تحديد مسافة الحرم");
                        else {
                            let bufferGeometries = [],
                                bufferObjects = [],
                                fieldInfos = [],
                                bufferLayer;
                            let bufferDistance = document.getElementById("bufferDistance").value;
                            let bufferUnit = document.getElementById("bufferUnit").value;
                            let bufferDistanceField = document.getElementById("bufferDistanceField").value;


                            if (selectedLayer.type === "graphics") {
                                const fields = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                bufferLayer = new FeatureLayer({
                                    title: selectedLayer.title + "_buffer_ " + bufferDistance,
                                    source: [],
                                    opacity: .5,
                                    fields: fields,
                                    geometryType: "polygon",
                                    renderer: {
                                        type: "simple",
                                        symbol: {
                                            type: "simple-fill",
                                            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                                            outline: {
                                                color: "rgba(255,255,255,1)",
                                                width: 2,
                                            }
                                        }
                                    },
                                    spatialReference: selectedLayer.spatialReference,
                                });


                                selectedLayer.graphics.items.forEach(feature => {
                                    let bufferGeometry = geometryEngine.geodesicBuffer(feature.geometry, bufferDistance, bufferUnit);
                                    let bufferGraphic = new Graphic({
                                        geometry: bufferGeometry,
                                        symbol: {
                                            type: "simple-fill",

                                        }
                                    });
                                    //view.graphics.add(bufferGraphic)
                                    bufferLayer.source.push(bufferGraphic)
                                });


                            } else {
                                bufferLayer = new FeatureLayer({
                                    title: selectedLayer.title + "_buffer_ " + bufferDistance,
                                    source: [],
                                    opacity: .5,
                                    geometryType: "polygon",
                                    fields: selectedLayer.fields,
                                    popupEnabled: true,
                                    outFields: ["*"],

                                    spatialReference: selectedLayer.spatialReference,
                                });

                                if (selectedLayer.fields !== undefined) {
                                    selectedLayer.fields.forEach(field => {
                                        let attrField = {
                                            fieldName: field.name
                                        }
                                        fieldInfos.push(attrField)
                                    })
                                    let bufferLayerPopup = {
                                        title: "العنصر رقم {ObjectID}",
                                        content: [{
                                            type: "fields", // Autocasts as new FieldsContent()
                                            // Autocasts as new FieldInfo[]
                                            fieldInfos: fieldInfos
                                        }]
                                    }

                                    bufferLayer.popupTemplate = bufferLayerPopup;
                                }



                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {

                                        let bufferGeometry;
                                        if (document.getElementById("bufferDistanceType").value === "existing") {
                                            bufferGeometry = geometryEngine.geodesicBuffer(feature.geometry, feature.attributes[bufferDistanceField], bufferUnit);
                                        } else {
                                            bufferGeometry = geometryEngine.geodesicBuffer(feature.geometry, bufferDistance, bufferUnit);
                                        }


                                        let bufferGraphic = new Graphic({
                                            geometry: bufferGeometry,
                                            attributes: feature.attributes,
                                            symbol: {
                                                type: "simple-fill",
                                                color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                                                outline: {
                                                    color: "rgba(200,200,200,.2)",
                                                    width: 2
                                                }
                                            }
                                        });
                                        //view.graphics.add(bufferGraphic)
                                        bufferLayer.source.push(bufferGraphic)
                                    });


                                }); // after queryFeatures




                            } //else layer is not graphic

                            mapsList[activeMap].add(bufferLayer)
                            legend.layerInfos.push({
                                layer: bufferLayer,
                            });

                        } // else distance has been provided

                    }); //runBuffer

                }); //bufferAnalysisBtn


                //     bufferDistanceType  bufferDistanceField bufferDistance




                //==================== Intersection Analysis ========================================


                let intersectionAnalysisWidget = document.getElementById('intersectionAnalysisWidgetTemplate').cloneNode(true);

                document.getElementById("intersectAnalysisBtn").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(intersectionAnalysisWidget, "top-left");
                    activateWidgetHeader();
                    upadateLayerList("intersectionLayer1");
                    upadateLayerList("intersectionLayer2");

                    let geom1 = [],
                        geom2 = [],
                        attr1 = [],
                        attr2 = [],
                        fieldInfos = [],
                        fields1, fields2, intersectionLayer;
                    let intersectionLayer1;
                    let intersectionLayer2;
                    let selectedLayer1;
                    let selectedLayer2;

                    document.getElementById("intersectionLayer1").addEventListener("change", function() {
                        if (document.getElementById("intersectionLayer1").value !== "") {
                            // getting the geometry & fields of the first layer
                            attr1 = [];
                            geom1 = [];
                            fields1 = [];
                            intersectionLayer1 = document.getElementById("intersectionLayer1").value;
                            selectedLayer1 = mapsList[activeMap].findLayerById(intersectionLayer1);
                            if (selectedLayer1.type === "graphics") {
                                fields1 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer1.graphics.items.forEach(feature => {
                                    geom1.push(feature.geometry);
                                });
                            } else {
                                fields1 = selectedLayer1.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer1.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom1.push(feature.geometry);
                                        attr1.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });

                    document.getElementById("intersectionLayer2").addEventListener("change", function() {
                        if (document.getElementById("intersectionLayer2").value !== "") {
                            // getting the geometry & fields of the second layer
                            attr2 = [];
                            geom2 = [];
                            fields2 = [];
                            intersectionLayer2 = document.getElementById("intersectionLayer2").value;;
                            selectedLayer2 = mapsList[activeMap].findLayerById(intersectionLayer2);
                            if (selectedLayer2.type === "graphics") {
                                fields2 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer2.graphics.items.forEach(feature => {
                                    geom2.push(feature.geometry);
                                });

                            } else {
                                fields2 = selectedLayer2.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer2.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom2.push(feature.geometry);
                                        attr2.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });


                    document.getElementById("runIntersection").addEventListener("click", function() {

                        if (document.getElementById("intersectionLayer1").value === "" || document.getElementById("intersectionLayer2").value === "")
                            alert("الرجاء تحديد الطبقات");
                        else {

                            if (selectedLayer1.geometryType === "polygon" && selectedLayer2.geometryType === "polygon") {
                                runIntersection();

                            } else if (selectedLayer1.geometryType !== "polygon" || selectedLayer2.geometryType !== "polygon") {
                                if (selectedLayer1.type === "graphics" || selectedLayer2.type === "graphics") {
                                    runIntersection();
                                } else {

                                    alert("الرجاء اختيار طبقات من نوع المضلعات");

                                } // else good to go

                            } //else layers are provided


                        } // if layers are polygon


                        function runIntersection() {

                            //merge layers list of fields
                            fields2.forEach(field => {
                                field.name = field.name + "2"
                                fields1.push(field)
                            });

                            // prepare result layer
                            intersectionLayer = new FeatureLayer({
                                title: selectedLayer1.title + "_" + selectedLayer2.title + "_تقاطع",
                                source: [],
                                fields: fields1,
                                geometryType: "polygon",
                                renderer: {
                                    type: "simple",
                                    symbol: {
                                        type: "simple-fill",
                                        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                                        outline: {
                                            color: "rgba(255,255,255,1)",
                                            width: 2,
                                        }
                                    }
                                },
                                popupEnabled: true,
                                //popupTemplate: intersectionLayerPopup,
                                outFields: ["*"],
                                spatialReference: selectedLayer1.spatialReference,
                            });
                            let objectID = 0;
                            for (let i = 0; i < geom1.length; i++) {
                                for (let j = 0; j < geom2.length; j++) {
                                    let intersectionGeom = geometryEngine.intersect(geom1[i], geom2[j]);
                                    if (intersectionGeom) {
                                        let attributes = {},
                                            firstAttr = {},
                                            secondAttr = {};

                                        if (attr1[i]) {
                                            firstAttr = attr1[i];
                                            for (const [key, value] of Object.entries(firstAttr)) {
                                                attributes[key] = value;
                                            }
                                        }
                                        if (attr2[j]) {
                                            secondAttr = attr2[j];

                                            for (const [key, value] of Object.entries(secondAttr)) {
                                                attributes[key + "2"] = value;
                                            }
                                        }

                                        attributes["OBJECTID"] = objectID;
                                        objectID += 1;

                                        let intersectionGraphic = new Graphic({
                                            geometry: intersectionGeom,
                                            symbol: {
                                                type: "simple-fill",
                                            },
                                            attributes: attributes,
                                        });
                                        //view.graphics.add(intersectionGraphic)
                                        intersectionLayer.source.push(intersectionGraphic)

                                        ///console.log(intersectionLayer.source)
                                    }
                                }
                            }

                            fieldInfos = [];
                            fields1.forEach(field => {
                                let attrField = {
                                    fieldName: field.name
                                }
                                fieldInfos.push(attrField)
                            })
                            let intersectionLayerPopup = {
                                title: "العنصر رقم {ObjectID}",
                                content: [{
                                    type: "fields", // Autocasts as new FieldsContent()
                                    // Autocasts as new FieldInfo[]
                                    fieldInfos: fieldInfos
                                }]
                            }

                            //console.log(intersectionGraphic)
                            intersectionLayer.popupTemplate = intersectionLayerPopup;

                            mapsList[activeMap].add(intersectionLayer)
                            legend.layerInfos.push({
                                layer: intersectionLayer,
                            });

                        } //runIntersection


                    }); //runIntersection

                }); // intersectionAnalysisBtn










                //==================== union Analysis ========================================


                let unionAnalysisWidget = document.getElementById('unionAnalysisWidgetTemplate').cloneNode(true);

                document.getElementById("unionAnalysisBtn").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(unionAnalysisWidget, "top-left");
                    activateWidgetHeader();

                    let geometries = [],
                        unionLayersNo
                    document.getElementById("unionLayersNo").addEventListener("change", function() {
                        unionLayersNo = document.getElementById("unionLayersNo").value;
                        if (unionLayersNo !== "") {
                            //document.getElementById('unionLayersDiv').innerHTML = "";

                            for (i = 0; i < 10; i++) {
                                let unionLayerSelector = document.getElementById("unionLayer" + i);
                                if (i < unionLayersNo) {
                                    unionLayerSelector.style.display = "flex";
                                    upadateLayerList("unionLayer" + i);


                                    unionLayerSelector.addEventListener("change", function() {
                                        let id = Number(event.target.id[10]);
                                        geometries[id] = [];
                                        if (unionLayerSelector.value !== "") {
                                            selectedLayer = mapsList[activeMap].findLayerById(unionLayerSelector.value);
                                            if (selectedLayer.type === "graphics") {
                                                selectedLayer.graphics.items.forEach(feature => {
                                                    geometries[id].push(feature.geometry);
                                                });
                                            } else {
                                                var Query = {
                                                    returnGeometry: true,
                                                };

                                                selectedLayer.queryFeatures(Query).then(function(result) {
                                                    result.features.forEach(feature => {
                                                        geometries[id].push(feature.geometry);
                                                    });
                                                });

                                            }


                                        }
                                    });


                                } else
                                    unionLayerSelector.style.display = "none";

                            }




                        } // if unionLayers != "

                    });

                    let mergedGeometries, finalGeometry, unionLayer;
                    document.getElementById("rununion").addEventListener("click", function() {
                        let emptyLayers = false;
                        let wrongGeometry = false;
                        let firstGeom = geometries[0];
                        for (i = 0; i < unionLayersNo; i++) {
                            if (document.getElementById("unionLayer" + i).value === "") {
                                emptyLayers = true;
                            }
                            let layerGeom = geometries[i];
                            if (layerGeom[0].type !== firstGeom[0].type)
                                wrongGeometry = true;
                        }
                        if (emptyLayers)
                            alert("الرجاء ادخال جميع الطبقات")
                        else if (wrongGeometry)
                            alert("الرجاء اختيار طبقات من نفس النوع")
                        else
                            runUnion();

                    });

                    function runUnion() {

                        mergedGeometries = [];

                        unionLayer = new FeatureLayer({
                            title: "طبقات مدموجة " + unionLayersNo,
                            source: [],
                            geometryType: "polygon",
                            fields: [{
                                name: "ObjectID",
                                alias: "ObjectID",
                                type: "oid"
                            }],
                            renderer: {
                                type: "simple",
                                symbol: {
                                    type: "simple-fill",
                                    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                                    outline: {
                                        color: "rgba(255,255,255,1)",
                                        width: 2,
                                    }
                                }
                            },
                            spatialReference: {},
                        });

                        for (i = 0; i < unionLayersNo; i++) {
                            let geom = geometries[i];
                            let union = geometryEngine.union(geom);
                            mergedGeometries.push(union);
                        }

                        let finalGeometry = geometryEngine.union(mergedGeometries);
                        unionLayer.spatialReference = finalGeometry.spatialReference;

                        let unionGraphic = new Graphic({
                            geometry: finalGeometry,
                            symbol: {
                                type: "simple-fill",
                            },
                        });

                        unionLayer.source.push(unionGraphic)
                        mapsList[activeMap].add(unionLayer);
                        legend.layerInfos.push({
                            layer: unionLayer,
                        });


                    }



                }); // unionAnalysisBtn




                //==================== clip Analysis ========================================


                let clipAnalysisWidget = document.getElementById('clipAnalysisWidgetTemplate').cloneNode(true);

                document.getElementById("clipAnalysisBtn").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(clipAnalysisWidget, "top-left");
                    activateWidgetHeader();
                    upadateLayerList("clipLayer1");
                    upadateLayerList("clipLayer2");

                    let geom1 = [],
                        geom2 = [],
                        attr1 = [],
                        attr2 = [],
                        fieldInfos = [],
                        fields1, fields2, clipLayer;
                    let clipLayer1;
                    let clipLayer2;
                    let selectedLayer1;
                    let selectedLayer2;

                    let clipSymbol;





                    document.getElementById("clipLayer1").addEventListener("change", function() {
                        if (document.getElementById("clipLayer1").value !== "") {
                            // getting the geometry & fields of the first layer
                            attr1 = [];
                            geom1 = [];
                            fields1 = [];
                            clipLayer1 = document.getElementById("clipLayer1").value;
                            selectedLayer1 = mapsList[activeMap].findLayerById(clipLayer1);
                            if (selectedLayer1.type === "graphics") {
                                fields1 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer1.graphics.items.forEach(feature => {
                                    geom1.push(feature.geometry);
                                });
                            } else {
                                fields1 = selectedLayer1.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer1.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom1.push(feature.geometry);
                                        attr1.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });

                    document.getElementById("clipLayer2").addEventListener("change", function() {
                        if (document.getElementById("clipLayer2").value !== "") {
                            // getting the geometry & fields of the second layer
                            attr2 = [];
                            geom2 = [];
                            fields2 = [];
                            clipLayer2 = document.getElementById("clipLayer2").value;;
                            selectedLayer2 = mapsList[activeMap].findLayerById(clipLayer2);
                            if (selectedLayer2.type === "graphics") {
                                fields2 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer2.graphics.items.forEach(feature => {
                                    geom2.push(feature.geometry);
                                });

                            } else {
                                fields2 = selectedLayer2.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer2.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom2.push(feature.geometry);
                                        attr2.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });



                    document.getElementById("runclip").addEventListener("click", function() {

                        if (document.getElementById("clipLayer1").value === "" || document.getElementById("clipLayer2").value === "")
                            alert("الرجاء تحديد جميع الطبقات")
                        else if (selectedLayer2.geometryType !== "polygon") {
                            if (selectedLayer2.type === "graphics")
                                runclip();
                            else
                                alert("طبقة الاقتطاع يجب تكون تكون من المضلعات")
                        } else
                            runclip();

                    });



                    function runclip() {
                        let inputGeom = geom1[0].type;
                        switch (inputGeom) {
                            case "point":
                                clipSymbol = PointsSymbol;
                                break;
                            case "polyline":
                                clipSymbol = LinesSymbol;
                                break;
                            default:
                                clipSymbol = PolygonsSymbol;
                                break;
                        }

                        let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                        clipSymbol.color = color;

                        clipLayer = new FeatureLayer({
                            title: selectedLayer1.title + "_" + selectedLayer2.title + "_اقتطاع",
                            source: [],
                            fields: selectedLayer1.fields,
                            geometryType: selectedLayer1.geometryType,
                            renderer: {
                                type: "simple",
                                symbol: clipSymbol,
                            },
                            popupEnabled: true,
                            //popupTemplate: clipLayerPopup,
                            outFields: ["*"],
                            spatialReference: selectedLayer1.spatialReference,
                        });


                        let objectID = 0;
                        for (let i = 0; i < geom1.length; i++) {
                            for (let j = 0; j < geom2.length; j++) {
                                var clipGeom = geometryEngine.intersect(geom1[i], geom2[j]);

                                if (clipGeom) {
                                    let attributes = {},
                                        firstAttr = {};

                                    if (attr1[i]) {
                                        firstAttr = attr1[i];
                                        for (const [key, value] of Object.entries(firstAttr)) {
                                            attributes[key] = value;
                                        }
                                    }

                                    attributes["OBJECTID"] = objectID;
                                    objectID += 1;

                                    let clipGraphic = new Graphic({
                                        geometry: clipGeom,
                                        symbol: clipSymbol,
                                        attributes: attributes,
                                    });
                                    clipLayer.source.push(clipGraphic)
                                        //view.graphics.add(clipGraphic)

                                    fieldInfos = [];
                                    selectedLayer1.fields.forEach(field => {
                                        let attrField = {
                                            fieldName: field.name
                                        }
                                        fieldInfos.push(attrField)
                                    })
                                    let clipLayerPopup = {
                                        title: "العنصر رقم {ObjectID}",
                                        content: [{
                                            type: "fields", // Autocasts as new FieldsContent()
                                            // Autocasts as new FieldInfo[]
                                            fieldInfos: fieldInfos
                                        }]
                                    }

                                    clipLayer.popupTemplate = clipLayerPopup;

                                    mapsList[activeMap].add(clipLayer)
                                    legend.layerInfos.push({
                                        layer: clipLayer,
                                    });


                                }
                            }
                        };
                    }




                }); // clipAnalysisBtn






                //==================== touch Analysis ========================================


                let touchAnalysisWidget = document.getElementById('touchAnalysisWidgetTemplate').cloneNode(true);

                document.getElementById("touchAnalysisBtn").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(touchAnalysisWidget, "top-left");
                    activateWidgetHeader();
                    upadateLayerList("touchLayer1");
                    upadateLayerList("touchLayer2");

                    let geom1 = [],
                        geom2 = [],
                        attr1 = [],
                        attr2 = [],
                        fieldInfos = [],
                        fields1, fields2, touchLayer;
                    let touchLayer1;
                    let touchLayer2;
                    let selectedLayer1;
                    let selectedLayer2;

                    document.getElementById("touchLayer1").addEventListener("change", function() {
                        if (document.getElementById("touchLayer1").value !== "") {
                            // getting the geometry & fields of the first layer
                            geom1 = [];
                            touchLayer1 = document.getElementById("touchLayer1").value;
                            selectedLayer1 = mapsList[activeMap].findLayerById(touchLayer1);
                            if (selectedLayer1.type === "graphics") {
                                selectedLayer1.graphics.items.forEach(feature => {
                                    geom1.push(feature.geometry);
                                });
                            } else {
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer1.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom1.push(feature.geometry);
                                    });
                                });

                            }
                        }
                    });

                    document.getElementById("touchLayer2").addEventListener("change", function() {
                        if (document.getElementById("touchLayer2").value !== "") {
                            // getting the geometry & fields of the second layer
                            attr2 = [];
                            geom2 = [];
                            fields2 = [];
                            touchLayer2 = document.getElementById("touchLayer2").value;;
                            selectedLayer2 = mapsList[activeMap].findLayerById(touchLayer2);
                            if (selectedLayer2.type === "graphics") {
                                fields2 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer2.graphics.items.forEach(feature => {
                                    geom2.push(feature.geometry);
                                });

                            } else {
                                fields2 = selectedLayer2.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer2.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom2.push(feature.geometry);
                                        attr2.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });


                    document.getElementById("runtouch").addEventListener("click", function() {

                        if (document.getElementById("touchLayer1").value === "" || document.getElementById("touchLayer2").value === "")
                            alert("الرجاء تحديد الطبقات");
                        else {

                            if (selectedLayer1.geometryType === "polygon" && selectedLayer2.geometryType === "polygon") {
                                runtouch();

                            } else if (selectedLayer1.geometryType !== "polygon" || selectedLayer2.geometryType !== "polygon") {
                                if (selectedLayer1.type === "graphics" || selectedLayer2.type === "graphics") {
                                    runtouch();
                                } else {

                                    alert("الرجاء اختيار طبقات من نوع المضلعات");

                                } // else good to go

                            } //else layers are provided


                        } // if layers are polygon


                        function runtouch() {
                            // prepare result layer
                            touchLayer = new FeatureLayer({
                                title: selectedLayer1.title + "_" + selectedLayer2.title + "_تلامس",
                                source: [],
                                fields: fields2,
                                geometryType: "polygon",
                                renderer: {
                                    type: "simple",
                                    symbol: {
                                        type: "simple-fill",
                                        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                                        outline: {
                                            color: "rgba(255,255,255,1)",
                                            width: 2,
                                        }
                                    }
                                },
                                popupEnabled: true,
                                //popupTemplate: touchLayerPopup,
                                outFields: ["*"],
                                spatialReference: selectedLayer1.spatialReference,
                            });
                            for (let i = 0; i < geom1.length; i++) {
                                for (let j = 0; j < geom2.length; j++) {
                                    let touch = geometryEngine.touches(geom1[i], geom2[j]);
                                    if (touch) {
                                        let attributes = {};
                                        if (attr2[j]) {
                                            attributes = attr2[j];
                                        }
                                        let touchGraphic = new Graphic({
                                            geometry: geom2[j],
                                            symbol: {
                                                type: "simple-fill",
                                            },
                                            attributes: attributes,
                                        });
                                        //view.graphics.add(touchGraphic)
                                        touchLayer.source.push(touchGraphic)

                                        ///console.log(touchLayer.source)
                                    }
                                }
                            }

                            fieldInfos = [];
                            fields2.forEach(field => {
                                let attrField = {
                                    fieldName: field.name
                                }
                                fieldInfos.push(attrField)
                            })
                            let touchLayerPopup = {
                                title: "العنصر رقم {ObjectID}",
                                content: [{
                                    type: "fields", // Autocasts as new FieldsContent()
                                    // Autocasts as new FieldInfo[]
                                    fieldInfos: fieldInfos
                                }]
                            }

                            //console.log(touchGraphic)
                            touchLayer.popupTemplate = touchLayerPopup;

                            mapsList[activeMap].add(touchLayer)
                            legend.layerInfos.push({
                                layer: touchLayer,
                            });

                        } //runtouch


                    }); //runtouch

                }); // touchAnalysisBtn







                //==================== near Analysis ========================================


                let nearAnalysisWidget = document.getElementById('nearAnalysisWidgetTemplate').cloneNode(true);

                document.getElementById("nearAnalysisBtn").addEventListener("click", function() {
                    clearLeftWidgets();
                    view.ui.add(nearAnalysisWidget, "top-left");
                    activateWidgetHeader();
                    upadateLayerList("nearLayer1");
                    upadateLayerList("nearLayer2");

                    let geom1 = [],
                        geom2 = [],
                        attr1 = [],
                        attr2 = [],
                        center1 = [],
                        center2 = [],
                        fieldInfos = [],
                        fields1, fields2, nearLayer;
                    let nearLayer1;
                    let nearLayer2;
                    let selectedLayer1;
                    let selectedLayer2;



                    document.getElementById("nearLayer1").addEventListener("change", function() {
                        if (document.getElementById("nearLayer1").value !== "") {
                            // getting the geometry & fields of the second layer
                            attr1 = [];
                            geom1 = [];
                            center1 = [];
                            fields1 = [];
                            nearLayer1 = document.getElementById("nearLayer1").value;;
                            selectedLayer1 = mapsList[activeMap].findLayerById(nearLayer1);
                            if (selectedLayer1.type === "graphics") {
                                fields1 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer1.graphics.items.forEach(feature => {
                                    geom1.push(feature.geometry);
                                    center1.push(feature.geometry.centroid);
                                });

                            } else {
                                fields1 = selectedLayer1.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer1.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom1.push(feature.geometry);
                                        if (selectedLayer1.geometryType === "point")
                                            center1.push(feature.geometry);
                                        else
                                            center1.push(feature.geometry.centroid);
                                        attr1.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });

                    document.getElementById("nearLayer2").addEventListener("change", function() {
                        if (document.getElementById("nearLayer2").value !== "") {
                            // getting the geometry & fields of the second layer
                            attr2 = [];
                            geom2 = [];
                            fields2 = [];
                            nearLayer2 = document.getElementById("nearLayer2").value;;
                            selectedLayer2 = mapsList[activeMap].findLayerById(nearLayer2);
                            if (selectedLayer2.type === "graphics") {
                                fields2 = [{
                                    name: "ObjectID",
                                    alias: "ObjectID",
                                    type: "oid"
                                }];

                                selectedLayer2.graphics.items.forEach(feature => {
                                    geom2.push(feature.geometry);
                                    center2.push(feature.geometry.centroid);
                                });

                            } else {
                                fields2 = selectedLayer2.fields;
                                var Query = {
                                    outFields: ["*"],
                                    returnGeometry: true,
                                };

                                selectedLayer2.queryFeatures(Query).then(function(result) {
                                    result.features.forEach(feature => {
                                        geom2.push(feature.geometry);
                                        if (selectedLayer2.geometryType === "point")
                                            center2.push(feature.geometry);
                                        else
                                            center2.push(feature.geometry.centroid);
                                        attr2.push(feature.attributes);
                                    });
                                });

                            }
                        }
                    });


                    document.getElementById("runnear").addEventListener("click", function() {

                        if (document.getElementById("nearLayer1").value === "" || document.getElementById("nearLayer2").value === "")
                            alert("الرجاء تحديد الطبقات");
                        else
                            runnear();



                        function runnear() {
                            // prepare result layer
                            let inputGeom = selectedLayer2.geometryType;
                            switch (inputGeom) {
                                case "point":
                                    nearSymbol = PointsSymbol;
                                    break;
                                case "polyline":
                                    nearSymbol = LinesSymbol;
                                    break;
                                default:
                                    nearSymbol = PolygonsSymbol;
                                    break;
                            }

                            let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
                            nearSymbol.color = color;

                            //distance / nearest feature


                            nearLayer = new FeatureLayer({
                                title: selectedLayer1.title + "_" + selectedLayer2.title + "_القرب",
                                source: [],
                                fields: fields2,
                                geometryType: selectedLayer2.geometryType,
                                renderer: {
                                    type: "simple",
                                    symbol: nearSymbol,
                                },
                                popupEnabled: true,
                                //popupTemplate: nearLayerPopup,
                                outFields: ["*"],
                                spatialReference: selectedLayer2.spatialReference,
                            });

                            let attributes = {},
                                geometry, distance, nearestID;
                            for (let i = 0; i < geom1.length; i++) {
                                distance = 999999999;
                                for (let j = 0; j < geom2.length; j++) {
                                    let near = geometryEngine.nearestCoordinate(center1[i], center2[j]);
                                    if (near) {
                                        if (near.distance < distance) {
                                            distance = near.distance;
                                            let nearestFeatureAttr = attr1[i];
                                            nearestID = nearestFeatureAttr["OBJECTID"];
                                            attributes = {};
                                            if (attr2[j]) {
                                                attributes = attr2[j];
                                            }
                                            geometry = geom2[j];

                                        }
                                    }
                                }
                                attributes['nearestID'] = nearestID;
                                attributes['distance'] = distance;
                                let nearGraphic = new Graphic({
                                    geometry: geometry,
                                    symbol: {
                                        type: "simple-fill",
                                    },
                                    attributes: attributes,
                                });
                                //view.graphics.add(nearGraphic)
                                nearLayer.source.push(nearGraphic)

                                ///console.log(nearLayer.source)


                            }

                            fieldInfos = [];
                            fields2.forEach(field => {
                                let attrField = {
                                    fieldName: field.name
                                }
                                fieldInfos.push(attrField)
                            })
                            fieldInfos.push({
                                fieldName: "nearestID",
                            });
                            fieldInfos.push({
                                fieldName: "distance"
                            });
                            //console.log(nearLayer.source)
                            //console.log(fieldInfos)
                            let nearLayerPopup = {
                                title: "العنصر رقم {ObjectID}",
                                content: [{
                                    type: "fields", // Autocasts as new FieldsContent()
                                    // Autocasts as new FieldInfo[]
                                    fieldInfos: fieldInfos
                                }]
                            }

                            //console.log(nearGraphic)
                            nearLayer.popupTemplate = nearLayerPopup;

                            mapsList[activeMap].add(nearLayer)
                            legend.layerInfos.push({
                                layer: nearLayer,
                            });

                        } //runnear


                    }); //runnear

                }); // nearAnalysisBtn












                function clearLeftWidgets() {
                    view.ui.empty("top-left");
                    view.ui.empty("bottom-left");
                    /*
                    for (let i = 0; i < widgetToggles.length; i++) {
                        if (widgetToggles[i].name === "basemap") {} else {
                            widgetToggles[i].checked = false;
                        }
                    }
                    */
                }


                // Event handler that fires each time an action is clicked.
                view.popup.on("trigger-action", function(event) {
                    // Execute the measureThis() function if the measure-this action is clicked
                    if (event.action.id === "navigateTo") {
                        navigateToFun()
                    }
                })



                //--------------- Handle view loading process ----------------------------------
                view.when(function() {
                    // All the resources in the MapView and the map have loaded. Now execute additional processes
                    //console.log("load complete")
                    document.getElementsByClassName("lds-hourglass")[0].style.display = 'none';
                    editorToggleListener();
                    AppInfoWidgetListener();
                    resetInterfaceListener();
                    printToggleListener()
                    let fullExtent = view.extent;
                    document.getElementById("fullExtent").addEventListener("click", function() {
                        view.goTo(fullExtent);

                    });
                    //expandMenu(0)
                }, function(error) {
                    // Use the errback function to handle when the view doesn't load properly
                    console.log("The view's resources failed to load: ", error)
                })

                //--------------- Hide menu on view focus ----------------------------------
                view.on("focus", function(event) {
                    let menuCheck = document.getElementById("menuCheck")

                    if (menuCheck.checked == true) {
                        document.getElementById("menuCheck").checked = false
                        viewDiv.style.width = "100%"
                    }
                })




                //============================================================
                //==================== Global Functions and Listeners ===================================================================================================================================================================
                //============================================================
                function backBtnHandler() {
                    let widgetPathId = 0;
                    while (event.path[widgetPathId].id != "") {
                        widgetPathId += 1;
                    }

                    widgetPathId -= 1;
                    let currentWidgetID = event.path[widgetPathId].id;
                    currentWidget = document.getElementById(currentWidgetID);
                    let currentMenuId;
                    for (let i = 1; i < currentWidget.children.length; i++) {
                        if (currentWidget.children[i].style.display === "flex" || currentWidget.children[i].style.display === "block") {
                            currentMenuId = currentWidget.children[i].id;
                        }
                    }
                    let previousMenuId = widgetBackMenus[currentMenuId];
                    switch (previousMenuId) {
                        case "none":
                            view.ui.empty("top-left");
                            break;
                        default:
                            for (i = 1; i < currentWidget.children.length; i++) {
                                currentWidget.children[i].style.display = "none";
                            }
                            //document.getElementById("widgetHeader").style.display = "flex";
                            document.getElementById(previousMenuId).style.display = "flex";
                            break;
                    }
                };

                function closeBtnHandler() {
                    view.ui.empty("top-left");
                }

                function activateWidgetHeader() {
                    document.getElementById("backWidgetBtn").addEventListener("click", backBtnHandler);
                    document.getElementById("closeWidgetBtn").addEventListener("click", closeBtnHandler);
                }


                // Download file as csv function
                const downloadBlobAsFile = function(csv, filename) {
                    let downloadLink = document.createElement("a")
                    let blob = new Blob([csv], {
                        type: 'text/csv'
                    })
                    let url = URL.createObjectURL(blob)
                    downloadLink.href = url
                    downloadLink.download = filename
                    document.body.appendChild(downloadLink)
                    downloadLink.click()
                    document.body.removeChild(downloadLink)
                }


                function upadateLayerList(selectElementID) {
                    let targetSelector = document.getElementById(selectElementID);
                    if (targetSelector) {
                        targetSelector.innerHTML = "";
                        var option = document.createElement("option")
                        option.value = "";
                        option.text = "اختر طبقة";
                        targetSelector.appendChild(option)
                        let allLayers = mapsList[activeMap].layers.items;
                        allLayers.forEach(layer => {
                            let layerId = layer.id;
                            let layerTitle = layer.title;

                            var option = document.createElement("option")
                            option.value = layerId
                            option.text = layerTitle
                            targetSelector.appendChild(option)
                        });
                    } else {
                        console.log(selectElementID + "is not found")
                    }
                }
                /**- */
                // Update all layers lists whenever map layers are changed
                let layersSelectors = ["queryLayers"];
                mapsList[activeMap].layers.on("change", function(event) {
                    layersSelectors.forEach(selectElementID => {
                        upadateLayerList(selectElementID);
                        document.getElementsByClassName("panel0")[0].style.maxHeight = "1000px";
                    });
                });



            }) //---------END Require-----------------------------------------------------------------------------------------------------------------

} //-------------------- 2D view ---------------------------------------------------------------------------------------


let overlay = document.getElementById("overlayDiv")

let ok = overlay.getElementsByTagName("input")[0]

function statusMessage(head, info) {
    document.getElementById("head").innerHTML = head
    document.getElementById("info").innerHTML = info
    overlay.style.visibility = "visible"
}

ok.addEventListener("click", function() {
    overlay.style.visibility = "hidden"
})
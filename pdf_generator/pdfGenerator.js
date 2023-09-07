
var pdf = require("pdf-creator-node");
var fs = require("fs");
var ExcelJS = require("exceljs"); 
var html = fs.readFileSync(__dirname + "/salarySlip.html", "utf8");

var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "25mm",
        contents: '<div style="text-align: center;">ZecData Technology Pvt. Ltd</div>'
    }
};

var users = [
    {
      name: "Shyam",
      age: "26",
    },
    {
      name: "Navjot",
      age: "26",
    },
    {
      name: "Vitthal",
      age: "26",
    },
];

// Create Excel workbook and worksheet
var workbook = new ExcelJS.Workbook();
var worksheet = workbook.addWorksheet("Users");

// Set headers for Excel worksheet
worksheet.addRow(["Name", "Age"]);
users.forEach(user => {
    worksheet.addRow([user.name, user.age]);
});

var excelFilePath = "./output.xlsx";

// Save the Excel file
workbook.xlsx.writeFile(excelFilePath)
    .then(function() {
        console.log("Excel file saved successfully!");
    })
    .catch(function(error) {
        console.error("Error saving Excel file:", error);
    });



pdf.create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });

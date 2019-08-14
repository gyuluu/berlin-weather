const express = require("express");
const app = express();
const hb = require("express-handlebars");
const https = require("https");
const { key } = require("./config");

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));
let body = "";
const req = https.request(
  {
    method: "GET",
    host: "api.openweathermap.org",
    path: "/data/2.5/weather?q=berlin,de&appid=" + key + "&units=metric"
  },
  resp => {
    if (resp.statusCode != 200) {
      console.log(resp.StatusCode);
    } else {
      resp
        .on("data", chunk => {
          body += chunk;
        })
        .on("end", () => {
          try {
            body = JSON.parse(body);
            console.log(body);
          } catch (err) {
            console.log(err);
          }
        })
        .on("error", err => console.log(err));
    }
  }
);
req.on("error", err => console.log(err));
req.end();

app.get("/", (req, res) => {
  res.render("welcome", {
    name: body.name,
    temp: body.main.temp,
    layout: "main"
  });
});

app.listen(process.env.PORT || 8080);

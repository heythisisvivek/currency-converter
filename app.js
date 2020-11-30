const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const nodemail = require("nodemailer");

const PORT = process.env.PORT || 3000;
const bodyParser = express.urlencoded({ extended: false });
app.set("view engine", "ejs");
app.use(express.static("assets"));

app.get("/", (req, res) => {
    res.render(path.join(__dirname, "view"));
})

app.get("/news", (req, res) => {
    res.render(path.join(__dirname, "view/news"));
})

app.get("/contact", (req, res) => {
    res.render(path.join(__dirname, "view/contact"));
})

app.post("/contact", bodyParser, (req, res) => {
    const transporter = nodemail.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        }
    });

    const options = {
        from: process.env.SMTP_EMAIL,
        to: process.env.EMAIL,
        subject: `${req.body.name} - Submitted contact form`,
        text: `
            ${req.body.name},
            ${req.body.email},
            ${req.body.subject},
            ${req.body.message}
        `
    }

    transporter.sendMail(options, (err, info) => {
        if(err) {
            console.log(err);
            res.redirect("/contact?msg=<span style='color: red'>Your form failed to submit</span>");
        } else {
            console.log(info);
            res.redirect("/contact?msg=<span style='color: green'>Your form has been submitted</span>");
        }
    })
})

app.get("/about", (req, res) => {
    res.render(path.join(__dirname, "view/about"));
})

app.listen(PORT, () => { console.log(`Server is running at ${PORT}`) });
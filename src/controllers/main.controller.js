const fs = require("fs");
const handlers = {}
const url = require('url')
const HomestayModel = require('../models/homestay.model')
const qs = require("qs");

handlers.readFile = (filepath) => {
    return new Promise((resolve, rejects) => {
        fs.readFile(filepath, "utf-8", (err, data) => {
            if (err) {
                rejects(err.message);
            } else {
                resolve(data);
            }
        });
    });
}

handlers.notFound = (req,res)=>{
    res.end('404')
}

handlers.displayDefault = async (req,res) => {
    let list = await HomestayModel.display()
    let html = ""
    list.forEach(element=>{
        html += `<th scope="row">${element.id}</th>
        <td><a href="/info?id=${element.id}">${element.name}</a></td>
        <td>${element.city}</td>
        <td>${element.price}</td>
        <td><a href="/update?id=${element.id}">chỉnh sửa</a></td>
        <td><a href="/delete?id=${element.id}">xóa</a></td>
        </tr>`
    })
    let dataHTML = await handlers.readFile("./src/views/index.html").catch((err)=>{
        console.log(err.message)
    })
    dataHTML = dataHTML.replace(`{list}`,html)
    res.writeHead(200,{"Content-Type":"text/html"})
    res.write(dataHTML)
    res.end()
}

handlers.displayInfo = async (req,res)=>{
    let id = await url.parse(req.url,true).query.id //type string
    let data = await HomestayModel.displayInfo(+id)
    let html = ""
    html += `
    <p>Tên : ${data[0].name}</p>
    <p>Thành phố : ${data[0].city}</p>
    <p>Số phòng ngủ : ${data[0].numberOfBedRoom}</p>
    <p>Số phòng vệ sinh : ${data[0].numberOfToilet}</p>
    <p>Gía : ${data[0].price}</p>
    <p>Mô tả : ${data[0].description}</p>`
    let dataHTML = await handlers.readFile("./src/views/info.html").catch((err)=>{
        console.log(err.message)
    })
    dataHTML = dataHTML.replace(`{info}`,html)
    res.writeHead(200,{"Content-Type":"text/html"})
    res.write(dataHTML)
    res.end()
}
handlers.add = async (req,res)=> {
    if (req.method === "GET") {
        let dataHTML = await handlers.readFile("./src/views/add.html").catch((err) => {
            console.log(err.message)
        })
        res.writeHead(200, {"Content-Type": "text/html"})
        res.write(dataHTML)
        res.end()
    } else {
        let data
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", async () => {
            data = qs.parse(data);
           await HomestayModel.add(data.undefinedhomestayName,data.city,data.bed,data.toilet,data.price,data.description).catch((err)=>{
               console.log(err.message)
           })
           res.writeHead(301,{"Location":"/"})
            res.end()
        })
    }
}

handlers.update = async (req,res) =>{
    if(req.method === "GET"){
        let id = await url.parse(req.url, true).query.id //type string
        let data = await HomestayModel.displayInfo(+id)
        let dataHTML = await handlers.readFile("./src/views/update.html")
        dataHTML = dataHTML.replace(`action="/update"`,`action="/update?id=${id}"`)
        dataHTML = dataHTML.replace(`"update_name"`,`"${data[0].name}"`)
        dataHTML = dataHTML.replace(`"update_city"`,`"${data[0].city}"`)
        dataHTML = dataHTML.replace(`"update_price"`,`${data[0].price}`)
        dataHTML = dataHTML.replace(`"update_bed"`,`${data[0].numberOfBedRoom}`)
        dataHTML = dataHTML.replace(`"update_toilet"`,`${data[0].numberOfToilet}`)
        dataHTML = dataHTML.replace(`"update_description"`,`"${data[0].description}"`)
        res.writeHead(200,{"Content-Type":"text/html"})
        res.write(dataHTML)
        res.end()
    }else {
        let id = await url.parse(req.url, true).query.id //type string
        let data
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", async () => {
            data = qs.parse(data);
            // console.log(id)
            // console.log(data)
            await HomestayModel.update(+id,data.undefinedhomestayName,data.city,data.bed,data.price,data.toilet,data.description).catch((err)=>{
                console.log(err.message)
            })
            res.writeHead(301, {"Location": "/"})
            res.end()
        })
    }
}

handlers.delete = async (req,res)=>{
    if(req.method === "GET"){
        let id = await url.parse(req.url, true).query.id //type string
        let dataHTML = await handlers.readFile("./src/views/delete.html")
        dataHTML = dataHTML.replace(`action="/delete"`,`action="/delete?id=${id}"`)
        res.writeHead(200,{"Content-Type":"text/html"})
        res.write(dataHTML)
        res.end()
    }else{
        let id = await url.parse(req.url, true).query.id //type string
        await HomestayModel.delete(+id).catch((err)=>{
            console.log(err.message)
        })
        res.writeHead(301, {"Location": "/"})
        res.end()
    }
}
module.exports = handlers
const BaseModel = require('./base.model')
class HomestayModel extends BaseModel{
    async display(){
        let sql = `select * from homestayinfo;`
        return await this.querySql(sql)
    }
    async displayInfo(id){
        let sql = `select * from homestayinfo where id = ${id}`
        return await this.querySql(sql)
    }
    async add(name,city,bed,toilet,price,description){
        let sql = `insert into homestayinfo (name,city,numberOfBedRoom,price,numberOfToilet,description)
values 
    (${name},${city},${bed},${price},${toilet},${description})`
        return await this.querySql(sql)
    }
}
module.exports = new HomestayModel()
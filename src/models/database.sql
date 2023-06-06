ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123';
create database homestay;
use homestay;
create table homestayInfo
(
    id              int primary key auto_increment,
    name            varchar(50),
    city            varchar(25),
    numberOfBedRoom int,
    price           int,
    numberOfToilet  int,
    description     varchar(255)
);
insert into homestayinfo
values
    (1, 'nhà 1', "Hà Nội", 2, 1000, 2, 'mô tả của nhà 1'),
    (2, 'nhà 2', "Đà Nẵng", 4, 5000, 5, 'mô tả của nhà 2'),
    (3, 'nhà 3', "Sài Gòn", 1, 2000, 3, 'mô tả của nhà 3');
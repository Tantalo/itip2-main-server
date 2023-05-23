CREATE TABLE `ITIP_mainDB`.`MacAddressUserDB` ( `MacAddress` VARCHAR(20) NOT NULL , `UserDB` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;

CREATE TABLE `LogCommands` ( `MacAddress` VARCHAR(20) NOT NULL , `Timestamp` BIGINT NOT NULL , `Command` VARCHAR(20) NOT NULL , `Status` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;
ALTER TABLE `LogCommands` ADD PRIMARY KEY( `MacAddress`, `Timestamp`);

CREATE TABLE `LogEvents` ( `MacAddress` VARCHAR(20) NOT NULL , `Timestamp` BIGINT NOT NULL , `EventName` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;
ALTER TABLE `LogEvents` ADD PRIMARY KEY( `MacAddress`, `Timestamp`);


//tcs e iph 
CREATE TABLE `LogCommands` (
  `MacAddress` varchar(20) NOT NULL,
  `Datetime` varchar(25) NOT NULL,
  `Command` varchar(50) NOT NULL,
  `Username` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `LogCommands` ADD PRIMARY KEY( `MacAddress`, `Datetime`);

CREATE TABLE `LogGpsCoord` ( `MacAddress` VARCHAR(20) NOT NULL , `Datetime`  VARCHAR(25) NOT NULL , `Latitude` VARCHAR(20) NOT NULL , `Longitude` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;
ALTER TABLE `LogGpsCoord` ADD PRIMARY KEY( `MacAddress`, `Datetime`);
CREATE TABLE `itip2`.`MacAddressUserDB` ( `MacAddress` VARCHAR(20) NOT NULL , `UserDB` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;

CREATE TABLE `LogCommands` ( `MacAddress` VARCHAR(20) NOT NULL , `Timestamp` BIGINT NOT NULL , `Command` VARCHAR(20) NOT NULL , `Status` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;

CREATE TABLE `LogEvents` ( `MacAddress` VARCHAR(20) NOT NULL , `Timestamp` BIGINT NOT NULL , `EventName` VARCHAR(20) NOT NULL ) ENGINE = InnoDB;


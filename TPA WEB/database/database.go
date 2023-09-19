package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func Instance() (*gorm.DB, error) {
	if db == nil {
		dsn := "host=localhost user=postgres password=123 dbname=TPA_WEB port=5432 sslmode=disable TimeZone=Asia/Shanghai"
		database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			return nil, err
		}
		db = database
	}

	return db, nil

}

package graph

import (
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Db    *gorm.DB
	Redis *redis.Client
}

//go:generate go run github.com/99designs/gqlgen generate

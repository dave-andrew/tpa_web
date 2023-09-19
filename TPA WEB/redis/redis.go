package redis

import (
	"github.com/go-redis/redis/v8"
)

var client *redis.Client

func CreateRedisClient() *redis.Client {

	if client == nil {
		curr := redis.NewClient(&redis.Options{
			Addr:     "localhost:6379",
			Password: "",
			DB:       0,
		})
		return curr
	}

	return client
}

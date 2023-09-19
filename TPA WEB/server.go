package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/dave-andrew/gqlgen-todos/database"
	"github.com/dave-andrew/gqlgen-todos/graph"
	"github.com/dave-andrew/gqlgen-todos/graph/model"
	"github.com/dave-andrew/gqlgen-todos/middleware"
	"github.com/dave-andrew/gqlgen-todos/redis"
	"github.com/go-chi/chi/v5"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db, err := database.Instance()

	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	redisClient := redis.CreateRedisClient()

	resolver := &graph.Resolver{
		Db:    db,
		Redis: redisClient,
	}

	r := chi.NewRouter()
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost", "http://localhost:5173", "http://localhost:6379", "http://localhost:8080"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	r.Use(middleware.AuthMiddleware)

	db.AutoMigrate(&model.User{}, &model.Post{}, &model.Comment{}, &model.Story{}, &model.Friend{}, &model.Reel{}, &model.Like{}, &model.ReelLike{}, &model.ReelComment{}, &model.Notification{}, &model.Group{}, &model.GroupPost{}, &model.GroupLike{}, &model.GroupComment{}, &model.GroupPending{}, &model.GroupRequest{}, &model.File{}, &model.Chat{}, &model.Chat{}, &model.GroupChat{}, &model.BlockNotification{})

	c := graph.Config{Resolvers: resolver}

	c.Directives.Auth = func(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {

		token := ctx.Value("TokenValue")

		if token == nil {
			return nil, &gqlerror.Error{
				Message: "Please Login",
			}
		}

		//validatedToken, err := middleware.ValidateJWTToken(token.(string))

		ctx = context.WithValue(ctx, "UserID", token)
		return next(ctx)
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(c))

	r.Handle("/", playground.Handler("GraphQL playground", "/query"))
	r.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

package middleware

import (
	"context"
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		println(token)

		if token != "" {
			ctx := context.WithValue(r.Context(), "TokenValue", token)
			r = r.WithContext(ctx)
		}

		next.ServeHTTP(w, r)
	})
}

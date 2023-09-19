package verification

import (
	"encoding/base64"
	"fmt"
	"github.com/dave-andrew/gqlgen-todos/middleware"
	"net/smtp"
	"net/url"
)

func EmailVerification(Email string, token string) (string, error) {

	encodedToken := url.PathEscape(base64.StdEncoding.EncodeToString([]byte(token)))

	href := "http://localhost:5173/verif/" + encodedToken

	from := "daveandrewnathaniel48@gmail.com"
	password := "grdfcerqpjchpnlk"
	to := Email

	smtpServer := "smtp.gmail.com"
	smtpPort := 587

	subject := "Email Verification"
	message := fmt.Sprintf("<html><body><p>Click <a href=\"%s\">here</a> to verify your email.</p></body></html>", href)

	msg := []byte("Subject: " + subject + "\r\n" +
		"From: " + from + "\r\n" +
		"To: " + to + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=utf-8\r\n" +
		"\r\n" +
		message)

	auth := smtp.PlainAuth("", from, password, smtpServer)
	err := smtp.SendMail(fmt.Sprintf("%s:%d", smtpServer, smtpPort), auth, from, []string{to}, msg)
	if err != nil {
		return "", err
	} else {
		return "Message Sent!", nil
	}
}

func ChangePassword(Email string, userID string) (string, error) {

	token, _ := middleware.GenerateJWTToken(userID)

	encodedToken := url.PathEscape(base64.StdEncoding.EncodeToString([]byte(token)))

	href := "http://localhost:5173/change_password/" + encodedToken

	from := "daveandrewnathaniel48@gmail.com"
	password := "grdfcerqpjchpnlk"
	to := Email

	smtpServer := "smtp.gmail.com"
	smtpPort := 587

	subject := "Password Recovery"
	message := fmt.Sprintf("<html><body><p>Click <a href=\"%s\">here</a> to change your account password.</p></body></html>", href)

	msg := []byte("Subject: " + subject + "\r\n" +
		"From: " + from + "\r\n" +
		"To: " + to + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=utf-8\r\n" +
		"\r\n" +
		message)

	auth := smtp.PlainAuth("", from, password, smtpServer)
	err := smtp.SendMail(fmt.Sprintf("%s:%d", smtpServer, smtpPort), auth, from, []string{to}, msg)
	if err != nil {
		return "", err
	} else {
		return "Message Sent!", nil
	}
}

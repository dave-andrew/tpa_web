package hash

import "golang.org/x/crypto/bcrypt"

func HashPass(password string) (string, error) {
	pass := []byte(password)
	hash, err := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func CheckPass (password string, hash string) bool {
	pass := []byte(password)
	hashed := []byte(hash)
	err := bcrypt.CompareHashAndPassword(hashed, pass)
	if err != nil {
		return false
	}
	return true
}
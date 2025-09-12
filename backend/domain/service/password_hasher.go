package service

// 例: bcrypt 実装を infrastructure で用意
type PasswordHasher interface {
	// 平文からハッシュを生成
	Hash(plain string) (string, error)
	// 保存済みハッシュと平文が一致するか（true: 一致）
	Compare(hash, plain string) bool
}

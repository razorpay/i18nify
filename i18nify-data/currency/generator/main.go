package main

import (
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
)

type TemplateData struct {
	PackageName   string
	StructName    string
	RootJSONKey   string // JSON key in root object (e.g., "currency_information")
	RootFieldName string // Go struct field name (e.g., "CurrencyInformation")
	DataContext   string // Context for error messages (e.g., "currency")
}

var (
	baseDir, _          = filepath.Abs("..")
	distDir             = filepath.Join(baseDir, "dist")
	protoDir            = filepath.Join(baseDir, "proto")
	dataFile            = filepath.Join(baseDir, "data.json")
	templateFile, _     = template.ParseFiles("go.template")
	testTemplateFile, _ = template.ParseFiles("data_loader_test.template")
)

func main() {
	log.Println("Generating currency micro-package...")

	if err := runProtoc(); err != nil {
		log.Fatalf("protoc failed: %v", err)
	}
	if err := generateDataLoader(); err != nil {
		log.Fatalf("data loader generation failed: %v", err)
	}
	if err := generateDataLoaderTest(); err != nil {
		log.Fatalf("data loader test generation failed: %v", err)
	}
	if err := initGoModule(); err != nil {
		log.Fatalf("go module init failed: %v", err)
	}
	if err := runTests(); err != nil {
		log.Fatalf("tests failed: %v", err)
	}
	log.Println("Currency micro-package generated successfully.")
}

func runProtoc() error {
	log.Println("Running protoc for currency...")
	cmd := exec.Command(
		"protoc",
		"--go_out="+distDir,
		"-I="+protoDir,
		filepath.Join(protoDir, "currency.proto"),
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func generateDataLoader() error {
	log.Println("Generating data_loader.go...")
	currencyDir := filepath.Join(distDir, "currency")
	if err := os.MkdirAll(currencyDir, 0o755); err != nil {
		return err
	}

	// Create data subdirectory and copy JSON file
	dataDir := filepath.Join(currencyDir, "data")
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return err
	}

	// Copy data.json to data/data.json for embedding
	dataDest := filepath.Join(dataDir, "data.json")
	if err := copyFile(dataFile, dataDest); err != nil {
		return err
	}

	view := TemplateData{
		PackageName:   "currency",
		StructName:    "CurrencyInfo",
		RootJSONKey:   "currency_information",
		RootFieldName: "CurrencyInformation",
		DataContext:   "currency",
	}
	outPath := filepath.Join(currencyDir, "data_loader.go")
	f, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer f.Close()
	// Use the template name which is the base name of the file
	return templateFile.ExecuteTemplate(f, filepath.Base("go.template"), view)
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	return err
}

func generateDataLoaderTest() error {
	log.Println("Generating data_loader_test.go...")
	currencyDir := filepath.Join(distDir, "currency")

	view := TemplateData{
		PackageName:   "currency",
		StructName:    "CurrencyInfo",
		RootJSONKey:   "currency_information",
		RootFieldName: "CurrencyInformation",
		DataContext:   "currency",
	}
	outPath := filepath.Join(currencyDir, "data_loader_test.go")
	f, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer f.Close()
	// Use the template name which is the base name of the file
	return testTemplateFile.ExecuteTemplate(f, filepath.Base("data_loader_test.template"), view)
}

func initGoModule() error {
	log.Println("Initializing go module github.com/razorpay/i18nify/packages/i18nify-go/currency...")
	moduleDir := filepath.Join(distDir, "currency")
	cmdInit := exec.Command("go", "mod", "init", "github.com/razorpay/i18nify/packages/i18nify-go/currency")
	cmdInit.Dir = moduleDir
	cmdInit.Stdout = os.Stdout
	cmdInit.Stderr = os.Stderr
	if err := cmdInit.Run(); err != nil {
		return err
	}
	// Set minimum Go version to 1.20 (required for unsafe.StringData used in protobuf)
	cmdEdit := exec.Command("go", "mod", "edit", "-go=1.20")
	cmdEdit.Dir = moduleDir
	cmdEdit.Stdout = os.Stdout
	cmdEdit.Stderr = os.Stderr
	if err := cmdEdit.Run(); err != nil {
		return err
	}
	cmdTidy := exec.Command("go", "mod", "tidy")
	cmdTidy.Dir = moduleDir
	cmdTidy.Stdout = os.Stdout
	cmdTidy.Stderr = os.Stderr
	return cmdTidy.Run()
}

func runTests() error {
	log.Println("Running tests for data_loader...")
	moduleDir := filepath.Join(distDir, "currency")
	cmd := exec.Command("go", "test", "-v", "./...")
	cmd.Dir = moduleDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

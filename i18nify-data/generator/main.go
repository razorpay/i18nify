package main

import (
	"encoding/json"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
)

// PackageConfig defines the configuration for a data package
type PackageConfig struct {
	PackageName   string `json:"package_name"`    // Go package name (e.g., "currency")
	StructName    string `json:"struct_name"`     // Struct type name (e.g., "CurrencyInfo")
	RootJSONKey   string `json:"root_json_key"`   // JSON key in root (e.g., "currency_information")
	RootFieldName string `json:"root_field_name"` // Go struct field (e.g., "CurrencyInformation")
	DataContext   string `json:"data_context"`    // Context for errors (e.g., "currency")
	ModulePath    string `json:"module_path"`     // Full module path (e.g., "github.com/razorpay/i18nify/packages/i18nify-go/currency")
	HasProto      bool   `json:"has_proto"`       // Whether package uses protobuf
	ProtoFile     string `json:"proto_file"`      // Proto file name (e.g., "currency.proto")
}

type TemplateData struct {
	PackageName   string
	StructName    string
	RootJSONKey   string
	RootFieldName string
	DataContext   string
}

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("Usage: %s <package-config.json>", os.Args[0])
	}

	configPath := os.Args[1]
	config, err := loadConfig(configPath)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	baseDir := filepath.Dir(configPath)
	packageName := filepath.Base(baseDir)

	log.Printf("Generating %s micro-package...", packageName)

	// Load templates from shared generator/templates location
	generatorDir := filepath.Join(filepath.Dir(filepath.Dir(configPath)), "generator")
	templateDir := filepath.Join(generatorDir, "templates")
	templateFile, err := template.ParseFiles(filepath.Join(templateDir, "go.template"))
	if err != nil {
		log.Fatalf("Failed to load go.template: %v", err)
	}
	testTemplateFile, err := template.ParseFiles(filepath.Join(templateDir, "data_loader_test.template"))
	if err != nil {
		log.Fatalf("Failed to load data_loader_test.template: %v", err)
	}

	distDir := filepath.Join(baseDir, "dist", config.PackageName)
	dataFile := filepath.Join(baseDir, "data.json")
	protoDir := filepath.Join(baseDir, "proto")

	// Create dist directory
	if err := os.MkdirAll(distDir, 0o755); err != nil {
		log.Fatalf("Failed to create dist directory: %v", err)
	}

	// Run protoc FIRST if needed (before generating data loader that references the struct)
	if config.HasProto {
		if err := runProtoc(protoDir, distDir, config.ProtoFile); err != nil {
			log.Fatalf("protoc failed: %v", err)
		}
	}

	// Generate data loader (after proto is generated)
	if err := generateDataLoader(distDir, dataFile, templateFile, config); err != nil {
		log.Fatalf("data loader generation failed: %v", err)
	}

	// Generate test
	if err := generateDataLoaderTest(distDir, testTemplateFile, config); err != nil {
		log.Fatalf("data loader test generation failed: %v", err)
	}

	// Initialize Go module
	if err := initGoModule(distDir, config); err != nil {
		log.Fatalf("go module init failed: %v", err)
	}

	// Mandatory: Run serialization/deserialization test
	if err := runSerializationTest(distDir); err != nil {
		log.Fatalf("CRITICAL: Serialization/deserialization test failed. Package generation aborted. %v", err)
	}

	log.Printf("%s micro-package generated successfully.", packageName)
}

func loadConfig(path string) (*PackageConfig, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var config PackageConfig
	if err := json.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	return &config, nil
}

func runProtoc(protoDir, distDir, protoFile string) error {
	log.Println("Running protoc...")
	// protoc generates files based on go_package option in proto file
	// The go_package option "./currency" creates a subdirectory, so we need to handle that
	cmd := exec.Command(
		"protoc",
		"--go_out="+distDir,
		"-I="+protoDir,
		filepath.Join(protoDir, protoFile),
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}

	// Check for generated files in subdirectories and move to distDir root
	// protoc creates subdirs based on go_package option (e.g., "./currency" creates currency/ subdir)
	entries, err := os.ReadDir(distDir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if entry.IsDir() && entry.Name() != "data" {
			subdir := filepath.Join(distDir, entry.Name())
			files, err := os.ReadDir(subdir)
			if err != nil {
				continue
			}
			// Move all .pb.go files from subdirectory to distDir root
			for _, file := range files {
				if filepath.Ext(file.Name()) == ".go" {
					src := filepath.Join(subdir, file.Name())
					dst := filepath.Join(distDir, file.Name())
					if err := os.Rename(src, dst); err != nil {
						log.Printf("Warning: Failed to move %s to %s: %v", src, dst, err)
					}
				}
			}
			// Remove empty subdirectory
			os.Remove(subdir)
		}
	}

	return nil
}

func generateDataLoader(distDir, dataFile string, templateFile *template.Template, config *PackageConfig) error {
	log.Println("Generating data_loader.go...")

	// Create data subdirectory and copy JSON file
	dataDir := filepath.Join(distDir, "data")
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return err
	}

	dataDest := filepath.Join(dataDir, "data.json")
	if err := copyFile(dataFile, dataDest); err != nil {
		return err
	}

	view := TemplateData{
		PackageName:   config.PackageName,
		StructName:    config.StructName,
		RootJSONKey:   config.RootJSONKey,
		RootFieldName: config.RootFieldName,
		DataContext:   config.DataContext,
	}

	outPath := filepath.Join(distDir, "data_loader.go")
	f, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer f.Close()

	return templateFile.ExecuteTemplate(f, filepath.Base("go.template"), view)
}

func generateDataLoaderTest(distDir string, testTemplateFile *template.Template, config *PackageConfig) error {
	log.Println("Generating data_loader_test.go...")

	view := TemplateData{
		PackageName:   config.PackageName,
		StructName:    config.StructName,
		RootJSONKey:   config.RootJSONKey,
		RootFieldName: config.RootFieldName,
		DataContext:   config.DataContext,
	}

	outPath := filepath.Join(distDir, "data_loader_test.go")
	f, err := os.Create(outPath)
	if err != nil {
		return err
	}
	defer f.Close()

	return testTemplateFile.ExecuteTemplate(f, filepath.Base("data_loader_test.template"), view)
}

func initGoModule(distDir string, config *PackageConfig) error {
	log.Printf("Initializing go module %s...", config.ModulePath)
	cmdInit := exec.Command("go", "mod", "init", config.ModulePath)
	cmdInit.Dir = distDir
	cmdInit.Stdout = os.Stdout
	cmdInit.Stderr = os.Stderr
	if err := cmdInit.Run(); err != nil {
		return err
	}

	// Set minimum Go version to 1.20
	cmdEdit := exec.Command("go", "mod", "edit", "-go=1.20")
	cmdEdit.Dir = distDir
	cmdEdit.Stdout = os.Stdout
	cmdEdit.Stderr = os.Stderr
	if err := cmdEdit.Run(); err != nil {
		return err
	}

	// Pin protobuf version if proto is used
	if config.HasProto {
		cmdRequire := exec.Command("go", "mod", "edit", "-require=google.golang.org/protobuf@v1.31.0")
		cmdRequire.Dir = distDir
		cmdRequire.Stdout = os.Stdout
		cmdRequire.Stderr = os.Stderr
		if err := cmdRequire.Run(); err != nil {
			return err
		}
	}

	cmdTidy := exec.Command("go", "mod", "tidy")
	cmdTidy.Dir = distDir
	cmdTidy.Stdout = os.Stdout
	cmdTidy.Stderr = os.Stderr
	return cmdTidy.Run()
}

func runSerializationTest(distDir string) error {
	log.Println("Running MANDATORY serialization/deserialization test...")
	log.Println("This test ensures data integrity before package generation completes.")
	cmd := exec.Command("go", "test", "-v", "-run", "TestGetData_SerializationDeserialization", "./...")
	cmd.Dir = distDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}
	log.Println("✓ Serialization/deserialization test passed. Data integrity verified.")
	return nil
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

## Master Data Overview

This project involves the use of **Master Data**, which acts as the foundational dataset for banking-related information. This master data serves as the source for generating country-specific datasets through a script. Below is a brief explanation of the data structure and its purpose.

### Master Data Structure

The master data is organized in a structured JSON format and includes details such as default identifier types, bank details, branch information, and specific identifiers. 

Example:

```json
{
    "defaults": {
        "identifier_type": "# default identifier_type for a given country (e.g., IFSC for India, SWIFT for Singapore, etc.)"
    },
    "details": [
        {
            "name": "# Official full name of the bank",
            "short_code": "# Short code of the bank, typically 4 letters",
            "branches": [
                {
                    "code": "# Branch code, typically 4-5 characters",
                    "city": "# City where the branch resides",
                    "identifiers": {
                        "swift_code": "# SWIFT code of the branch",
                        "routing_number": "# Routing number of the branch"
                    }
                }
            ]
        }
    ]
}
```


### How It Works

1. **Master Data Creation**: 
   - Populate the master data with information such as bank names, branch codes, city locations, and identifiers like SWIFT codes or routing numbers.
   
2. **Country-Specific Data Generation**:
   - Run the provided script to transform the master data into a structured JSON file tailored for a specific country. 
   - The script applies default values like `identifier_type` based on the target country.

### Key Benefits

- Centralized management of bank data for multiple countries.
- Easily scalable and maintainable through scripting.
- Supports various financial operations by providing country-specific data in a consistent format.

--- 
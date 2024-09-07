# Changelog

### v1.1.0 - [September 7, 2024]
- **New Features**:
  - Added support to omit specific properties from CSV output using the `omitProperties` parameter.
  - Enhanced functionality to omit nested properties using dot notation (e.g., `"user.age"` will omit the `age` field from the `user` object).
  
- **Improvements**:
  - Refined CSV formatting logic to handle omitted properties more efficiently.
  - Improved error handling for scenarios with missing or invalid property paths in dot notation.

- **Bug Fixes**:
  - Resolved an issue where certain fields with nested structures were not properly converted to CSV.

### v1.0.0 - [Initial Release]
- Basic CSV export functionality.
- Automatically generates CSV headers from JSON object keys.
- Handles nested objects in JSON.
- Lightweight, no external dependencies.
- Cross-browser compatibility with automatic file download support.

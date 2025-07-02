<?php

require_once __DIR__ . '/PresentationService.php';

/**
 * Simplified Presentation Generator Script
 * 
 * This script generates a presentation based on a title and content description
 * and saves it as a JSON file.
 */

// Set timeout settings for long-running process
ini_set('max_execution_time', '0');
ini_set('memory_limit', '512M');
set_time_limit(0);

// Parse command line arguments or use interactive mode
$title = '';
$message = '';
$outputFile = '';

if ($argc >= 3) {
    $title = $argv[1];
    $message = $argv[2];
    $outputFile = $argc >= 4 ? $argv[3] : generateFilename($title);
} else {
    echo "Interactive Mode:\n";
    echo "Enter presentation title: ";
    $title = trim(fgets(STDIN));
    echo "Enter presentation content description: ";
    $message = trim(fgets(STDIN));
    $outputFile = generateFilename($title);
}

echo "Generating presentation: \"{$title}\"\n";
echo "Description: \"{$message}\"\n";
echo "Output will be saved to: {$outputFile}\n\n";

try {
    // Check if OpenAI API key file exists
    $apiKeyPath = __DIR__ . '/../config/openai.txt';
    if (!file_exists($apiKeyPath)) {
        echo "OpenAI API key file not found at {$apiKeyPath}\n";
        echo "Please create this file with your OpenAI API key\n";
        exit(1);
    }

    // Initialize presentation service with retry configuration
    $maxRetries = 3;
    $retryDelay = 2;
    $exponentialBackoff = true;

    $presentationService = new PresentationService(
        $apiKeyPath,
        $maxRetries,
        $retryDelay,
        $exponentialBackoff
    );

    echo "Starting presentation generation...\n";
    echo "This may take several minutes depending on the complexity...\n";

    // Generate the presentation
    $result = $presentationService->createPresentation($title, $message);

    // Save presentation to file
    $filename = savePresentation($result['presentation'], $outputFile);

    echo "\nPresentation generation completed successfully!\n";
    echo "Saved to: {$filename}\n";
    echo "Statistics:\n";
    echo "- Total tokens used: " . ($result['tokens']['input'] + $result['tokens']['output']) . "\n";
    echo "  - Input tokens: " . $result['tokens']['input'] . "\n";
    echo "  - Output tokens: " . $result['tokens']['output'] . "\n";
    echo "- Total cost: $" . number_format($result['cost'], 4) . "\n";
} catch (\Exception $e) {
    echo "Error generating presentation: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Generate a filename based on the presentation title
 */
function generateFilename(string $title): string {
    // Create a safe filename
    $safeTitle = preg_replace('/[^a-zA-Z0-9_-]/', '_', $title);
    $safeTitle = substr($safeTitle, 0, 50); // Limit length
    $timestamp = date('Y-m-d_H-i-s');
    return "presentation_{$safeTitle}_{$timestamp}.json";
}

/**
 * Save the presentation data to a JSON file
 */
function savePresentation(array $presentationData, string $filename): string {
    $outputDir = __DIR__ . '/../../output';
    
    // Create output directory if it doesn't exist
    if (!is_dir($outputDir)) {
        mkdir($outputDir, 0755, true);
    }

    // Ensure the filename has .json extension
    if (!str_ends_with(strtolower($filename), '.json')) {
        $filename .= '.json';
    }
    
    $filepath = $outputDir . '/' . $filename;

    $jsonData = json_encode($presentationData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if (file_put_contents($filepath, $jsonData) === false) {
        throw new \Exception('Failed to save presentation to file');
    }

    return $filepath;
} 
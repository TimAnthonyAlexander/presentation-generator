<?php

declare(strict_types=1);

namespace timanthonyalexander\taa\service;

use Exception;
use TimAlexander\Marketanalysis\GPT;
use timanthonyalexander\taa\model\Presentation\PresentationModel;

class PresentationService
{
    private string $apiKeyPath;
    private float $totalCost = 0.0;
    private int $totalInputTokens = 0;
    private int $totalOutputTokens = 0;
    private ?PresentationModel $presentationModel = null;

    // Retry configuration
    private int $maxRetries = 3;
    private int $retryDelay = 2; // seconds
    private bool $exponentialBackoff = true;

    public function __construct(string $apiKeyPath, int $maxRetries = 3, int $retryDelay = 2, bool $exponentialBackoff = true)
    {
        $this->apiKeyPath = $apiKeyPath;
        $this->maxRetries = $maxRetries;
        $this->retryDelay = $retryDelay;
        $this->exponentialBackoff = $exponentialBackoff;
    }

    /**
     * Set the presentation model for status updates
     */
    public function setPresentationModel(PresentationModel $presentationModel): void
    {
        $this->presentationModel = $presentationModel;
    }

    /**
     * Set retry configuration
     */
    public function setRetryConfiguration(int $maxRetries, int $retryDelay = 2, bool $exponentialBackoff = true): void
    {
        $this->maxRetries = max(1, $maxRetries); // Ensure at least 1 attempt
        $this->retryDelay = max(1, $retryDelay); // Ensure at least 1 second delay
        $this->exponentialBackoff = $exponentialBackoff;
    }

    /**
     * Get current retry configuration
     */
    public function getRetryConfiguration(): array
    {
        return [
            'maxRetries' => $this->maxRetries,
            'retryDelay' => $this->retryDelay,
            'exponentialBackoff' => $this->exponentialBackoff
        ];
    }

    /**
     * Update presentation status with detailed information
     */
    private function updateStatus(string $status, string $description): void
    {
        if ($this->presentationModel === null) {
            return;
        }

        $this->presentationModel->status = $status;
        $this->presentationModel->statusDescription = $description;
        $this->presentationModel->updatedAt = date('Y-m-d H:i:s');
        if ($this->presentationModel->createdAt === null) {
            $this->presentationModel->createdAt = $this->presentationModel->updatedAt;
        }
        $this->presentationModel->save();
    }

    /**
     * Execute a GPT call with retry logic
     */
    private function executeWithRetry(callable $gptCall, string $operationName, string $statusPrefix = ''): array
    {
        $lastException = null;

        for ($attempt = 1; $attempt <= $this->maxRetries; $attempt++) {
            try {
                if ($attempt > 1) {
                    $this->updateStatus(
                        $statusPrefix . 'retrying',
                        "{$operationName} - Retry attempt {$attempt}/{$this->maxRetries}"
                    );

                    // Apply delay with optional exponential backoff
                    $delay = $this->exponentialBackoff
                        ? $this->retryDelay * pow(2, $attempt - 2)
                        : $this->retryDelay;

                    sleep($delay);
                }

                // Execute the GPT call
                $result = $gptCall();

                if ($attempt > 1) {
                    $this->updateStatus(
                        $statusPrefix . 'retry_success',
                        "{$operationName} - Succeeded on attempt {$attempt}"
                    );
                }

                return $result;
            } catch (\Exception $e) {
                $lastException = $e;

                // Log detailed error information
                error_log("GPT call failed on attempt {$attempt}/{$this->maxRetries} for {$operationName}:");
                error_log("  Error: " . $e->getMessage());
                error_log("  File: " . $e->getFile() . " Line: " . $e->getLine());

                // Check if this is a retryable error (network issues, rate limits, etc.)
                $isRetryable = $this->isRetryableError($e);

                if ($attempt === $this->maxRetries || !$isRetryable) {
                    $errorType = $isRetryable ? "after {$this->maxRetries} attempts" : "(non-retryable error)";
                    $this->updateStatus(
                        'failed',
                        "{$operationName} - Failed {$errorType}: " . $e->getMessage()
                    );

                    if (!$isRetryable) {
                        error_log("Non-retryable error encountered for {$operationName}, stopping retries");
                    }
                    break;
                } else {
                    $nextDelay = $this->exponentialBackoff
                        ? $this->retryDelay * pow(2, $attempt - 1)
                        : $this->retryDelay;

                    $this->updateStatus(
                        $statusPrefix . 'retry_needed',
                        "{$operationName} - Attempt {$attempt} failed: " . $e->getMessage() . ". Retrying in {$nextDelay} seconds..."
                    );
                }
            }
        }

        throw $lastException;
    }

    /**
     * Determine if an error is retryable or should fail immediately
     */
    private function isRetryableError(\Exception $e): bool
    {
        $errorMessage = strtolower($e->getMessage());

        // Retryable errors (network issues, rate limits, temporary API issues)
        $retryablePatterns = [
            'rate limit',
            'too many requests',
            'temporarily unavailable',
            'service unavailable',
            'timeout',
            'connection',
            'network',
            'server error',
            'internal error',
            'bad gateway',
            'gateway timeout',
            'overloaded',
            'try again',
            'curl error'
        ];

        foreach ($retryablePatterns as $pattern) {
            if (strpos($errorMessage, $pattern) !== false) {
                return true;
            }
        }

        // Non-retryable errors (authentication, invalid request format, etc.)
        $nonRetryablePatterns = [
            'invalid api key',
            'authentication',
            'unauthorized',
            'forbidden',
            'not found',
            'method not allowed',
            'unsupported',
            'invalid request',
            'bad request',
            'malformed',
            'quota exceeded' // Different from rate limit - usually means monthly/billing quota
        ];

        foreach ($nonRetryablePatterns as $pattern) {
            if (strpos($errorMessage, $pattern) !== false) {
                return false;
            }
        }

        // For JSON parsing errors, make them more reliably retryable
        // Check for both "json" keyword and common JSON error messages
        $jsonErrorPatterns = [
            'json',
            'syntax error',
            'control character error',
            'unexpected end of json input',
            'malformed json',
            'invalid json',
            'json decode error',
            'unexpected character',
            'unexpected token',
            'unterminated string',
            'invalid escape sequence'
        ];

        $isJsonError = false;
        foreach ($jsonErrorPatterns as $pattern) {
            if (strpos($errorMessage, $pattern) !== false) {
                $isJsonError = true;
                break;
            }
        }

        if ($isJsonError) {
            // Most JSON parsing errors are retryable as they often indicate
            // truncated responses, network corruption, or temporary API issues
            // Only skip retry for clearly structural issues
            $nonRetryableJsonPatterns = [
                'schema validation',
                'required field missing',
                'invalid structure'
            ];

            foreach ($nonRetryableJsonPatterns as $pattern) {
                if (strpos($errorMessage, $pattern) !== false) {
                    return false;
                }
            }

            return true; // Default to retryable for JSON errors
        }

        // Default to retryable for unknown errors
        return true;
    }

    /**
     * Save response to file for debugging purposes
     */
    private function saveResponseForDebugging(string $response, string $context, string $error = ''): string
    {
        $timestamp = date('Y-m-d_H-i-s');
        $filename = "presentation_debug_{$context}_{$timestamp}.txt";
        $filepath = __DIR__ . "/../../logs/{$filename}";

        // Ensure logs directory exists
        $logDir = dirname($filepath);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }

        $debugInfo = "=== PRESENTATION DEBUG LOG ===\n";
        $debugInfo .= "Timestamp: " . date('Y-m-d H:i:s') . "\n";
        $debugInfo .= "Context: {$context}\n";
        if (!empty($error)) {
            $debugInfo .= "Error: {$error}\n";
        }
        $debugInfo .= "Response Length: " . strlen($response) . "\n";
        $debugInfo .= "Retry Configuration: " . json_encode($this->getRetryConfiguration()) . "\n";
        $debugInfo .= "=== RAW RESPONSE ===\n";
        $debugInfo .= $response;
        $debugInfo .= "\n=== END RESPONSE ===\n";

        try {
            file_put_contents($filepath, $debugInfo);

            // Also update presentation model with debug info if available
            if ($this->presentationModel !== null) {
                $currentDebugFiles = json_decode($this->presentationModel->debugFiles ?? '[]', true);
                $currentDebugFiles[] = [
                    'filename' => $filename,
                    'filepath' => $filepath,
                    'context' => $context,
                    'error' => $error,
                    'timestamp' => date('Y-m-d H:i:s'),
                    'size' => strlen($response)
                ];
                $this->presentationModel->debugFiles = json_encode($currentDebugFiles);
                $this->presentationModel->save();
            }

            return $filepath;
        } catch (Exception $e) {
            error_log("Failed to save debug file: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Get all debug files created during this session
     */
    public function getDebugFiles(): array
    {
        if ($this->presentationModel === null) {
            return [];
        }

        return json_decode($this->presentationModel->debugFiles ?? '[]', true);
    }

    /**
     * Clean up old debug files (older than specified days)
     */
    public static function cleanupDebugFiles(int $daysOld = 7): int
    {
        $logDir = __DIR__ . "/../../logs/";
        if (!is_dir($logDir)) {
            return 0;
        }

        $cleanedCount = 0;
        $cutoffTime = time() - ($daysOld * 24 * 60 * 60);

        $files = glob($logDir . "presentation_debug_*.txt");
        foreach ($files as $file) {
            if (filemtime($file) < $cutoffTime) {
                if (unlink($file)) {
                    $cleanedCount++;
                }
            }
        }

        return $cleanedCount;
    }

    /**
     * Creates a presentation using a multi-step process:
     * 1. Plan content with o4-mini
     * 2. Research content with appropriate models
     * 3. Generate final presentation with o4-mini
     */
    public function createPresentation(string $title, string $message): array
    {
        // Reset usage tracking
        $this->resetUsage();

        $this->updateStatus('processing', 'Starting presentation generation process...');

        // Step 1: Plan the content with retry logic
        $this->updateStatus('planning', 'Analyzing presentation requirements and planning content structure...');
        $contentPlan = $this->executeWithRetry(
            fn() => $this->planContentInternal($title, $message),
            'Content Planning',
            'planning_'
        );

        $planSummary = $this->createPlanSummary($contentPlan);
        $this->updateStatus('planning_complete', "Content planning completed. {$planSummary}");

        // Step 2: Research the content with retry logic
        $this->updateStatus('researching', 'Beginning content research phase...');
        $researchedContent = $this->researchContentWithRetry($contentPlan);

        $this->updateStatus('research_complete', 'Content research completed. Preparing to generate final presentation...');

        // Step 3: Generate the final presentation with retry logic
        $this->updateStatus('generating', 'Generating final presentation with researched content...');
        $presentation = $this->executeWithRetry(
            fn() => $this->generatePresentationInternal($title, $message, $researchedContent),
            'Final Presentation Generation',
            'generating_'
        );

        $this->updateStatus('finalizing', 'Presentation generation completed, finalizing results...');

        return [
            'presentation' => $presentation,
            'contentPlan' => $contentPlan,
            'researchedContent' => $researchedContent,
            'cost' => $this->totalCost,
            'tokens' => [
                'input' => $this->totalInputTokens,
                'output' => $this->totalOutputTokens
            ]
        ];
    }

    /**
     * Create a summary of the content plan for status updates
     */
    private function createPlanSummary(array $contentPlan): string
    {
        $itemCount = count($contentPlan['content_items'] ?? []);
        $searchItems = 0;
        $regularItems = 0;

        foreach ($contentPlan['content_items'] ?? [] as $item) {
            if ($item['needs_search'] ?? false) {
                $searchItems++;
            } else {
                $regularItems++;
            }
        }

        return "Plan includes {$itemCount} content sections ({$searchItems} requiring web search, {$regularItems} using AI knowledge).";
    }

    /**
     * Step 1: Ask o4-mini what content is needed for the presentation (internal method with no retry logic)
     */
    private function planContentInternal(string $title, string $message): array
    {
        $this->updateStatus('planning', 'Using AI to analyze presentation requirements and create detailed content plan...');

        $gpt = $this->createGPTInstance('o4-mini');
        $gpt->setResponseFormat('json_object');

        $prompt = $this->createContentPlanningPrompt($title, $message);
        $gpt->addMessage('user', $prompt);

        $response = $gpt->getCompletion();
        $this->trackUsage($gpt);

        // Clean and parse the response
        $cleanResponse = $this->cleanJsonResponse($response);
        $contentPlan = json_decode($cleanResponse, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $jsonError = json_last_error_msg();
            $errorMsg = 'Error parsing content plan from AI response: ' . $jsonError;

            // Save the full response for debugging
            $debugFile = $this->saveResponseForDebugging($response, 'content_planning', $jsonError);

            // Enhanced logging with more details
            error_log("=== JSON PARSING ERROR IN planContentInternal() ===");
            error_log("JSON Error: " . $jsonError);
            error_log("Original response length: " . strlen($response));
            error_log("Cleaned response length: " . strlen($cleanResponse));
            error_log("Debug file saved: " . ($debugFile ?: 'FAILED TO SAVE'));
            error_log("First 1000 chars of original response: " . substr($response, 0, 1000));
            error_log("First 1000 chars of cleaned response: " . substr($cleanResponse, 0, 1000));
            error_log("Last 500 chars of cleaned response: " . substr($cleanResponse, -500));
            error_log("=== END JSON PARSING ERROR LOG ===");

            // Update status with debug file info
            $statusMsg = $errorMsg;
            if ($debugFile) {
                $statusMsg .= " (Debug file saved: " . basename($debugFile) . ")";
            }
            $this->updateStatus('failed', $statusMsg);

            throw new \Exception('Invalid JSON response from content planning: ' . $jsonError);
        }

        return $contentPlan;
    }

    /**
     * Step 2: Research the content based on the plan with retry logic
     */
    private function researchContentWithRetry(array $contentPlan): array
    {
        $researchedContent = [];
        $totalItems = count($contentPlan['content_items'] ?? []);

        if (!isset($contentPlan['content_items']) || !is_array($contentPlan['content_items'])) {
            $this->updateStatus('research_complete', 'No content items found in plan, skipping research phase.');
            return $researchedContent;
        }

        $currentItem = 0;
        foreach ($contentPlan['content_items'] as $item) {
            $currentItem++;

            if (!isset($item['topic']) || !isset($item['needs_search'])) {
                continue;
            }

            $topic = $item['topic'];
            $needsSearch = $item['needs_search'];

            if ($needsSearch) {
                $this->updateStatus('researching', "Researching topic {$currentItem}/{$totalItems}: '{$topic}' using web search...");

                // Execute search with retry logic
                $searchResult = $this->executeWithRetry(
                    fn() => $this->searchContentInternal($topic, $item['search_query'] ?? $topic),
                    "Search for '{$topic}'",
                    'research_'
                );

                $content = $searchResult['content'];
                $sources = $searchResult['sources'] ?? [];
            } else {
                $this->updateStatus('researching', "Generating content {$currentItem}/{$totalItems}: '{$topic}' using AI knowledge...");

                // Execute content generation with retry logic
                $content = $this->executeWithRetry(
                    fn() => ['content' => $this->generateContentInternal($topic, $item['context'] ?? '')],
                    "Generate content for '{$topic}'",
                    'research_'
                )['content'];

                $sources = [];
            }

            $researchedContent[] = [
                'topic' => $topic,
                'content' => $content,
                'sources' => $sources,
                'needs_search' => $needsSearch
            ];

            // Update progress
            $progress = round(($currentItem / $totalItems) * 100);
            $this->updateStatus('researching', "Research progress: {$progress}% complete ({$currentItem}/{$totalItems} topics processed)");
        }

        return $researchedContent;
    }

    /**
     * Step 2: Research the content based on the plan (original method - kept for backwards compatibility)
     */
    private function researchContent(array $contentPlan): array
    {
        $researchedContent = [];
        $totalItems = count($contentPlan['content_items'] ?? []);

        if (!isset($contentPlan['content_items']) || !is_array($contentPlan['content_items'])) {
            $this->updateStatus('research_complete', 'No content items found in plan, skipping research phase.');
            return $researchedContent;
        }

        $currentItem = 0;
        foreach ($contentPlan['content_items'] as $item) {
            $currentItem++;

            if (!isset($item['topic']) || !isset($item['needs_search'])) {
                continue;
            }

            $topic = $item['topic'];
            $needsSearch = $item['needs_search'];

            if ($needsSearch) {
                $this->updateStatus('researching', "Researching topic {$currentItem}/{$totalItems}: '{$topic}' using web search...");
                $searchResult = $this->searchContentInternal($topic, $item['search_query'] ?? $topic);
                $content = $searchResult['content'];
                $sources = $searchResult['sources'] ?? [];
            } else {
                $this->updateStatus('researching', "Generating content {$currentItem}/{$totalItems}: '{$topic}' using AI knowledge...");
                $content = $this->generateContentInternal($topic, $item['context'] ?? '');
                $sources = [];
            }

            $researchedContent[] = [
                'topic' => $topic,
                'content' => $content,
                'sources' => $sources,
                'needs_search' => $needsSearch
            ];

            // Update progress
            $progress = round(($currentItem / $totalItems) * 100);
            $this->updateStatus('researching', "Research progress: {$progress}% complete ({$currentItem}/{$totalItems} topics processed)");
        }

        return $researchedContent;
    }

    /**
     * Research content using search model (internal method with no retry logic)
     */
    private function searchContentInternal(string $topic, string $searchQuery): array
    {
        $gpt = $this->createGPTInstance('gpt-4o-mini-search-preview', 2000);

        $prompt = "Research and provide comprehensive information about: {$topic}\n\n";
        $prompt .= "Search query: {$searchQuery}\n\n";
        $prompt .= "Provide detailed, accurate, and up-to-date information that would be useful for a presentation slide about this topic. ";
        $prompt .= "Include key facts, statistics, examples, and important details.\n\n";
        $prompt .= "IMPORTANT: At the end of your response, add a section starting with 'SOURCES:' and list all the sources you used for this information. ";
        $prompt .= "Include website URLs, publication names, dates, or other relevant source information. Each source should be on a new line.";

        $gpt->addMessage('user', $prompt);
        $response = $gpt->getCompletion();
        $this->trackUsage($gpt);

        // Extract content and sources
        $parts = explode('SOURCES:', $response);
        $content = trim($parts[0]);
        $sources = [];

        if (count($parts) > 1) {
            $sourcesText = trim($parts[1]);
            if (!empty($sourcesText)) {
                // Split by lines and clean up
                $rawSources = explode("\n", $sourcesText);
                foreach ($rawSources as $source) {
                    $source = trim($source);
                    // Remove common prefixes like bullets, dashes, numbers
                    $source = preg_replace('/^[-•*\d+\.\)\s]+/', '', $source);
                    $source = trim($source);
                    if (!empty($source)) {
                        $sources[] = $source;
                    }
                }
            }
        }

        return [
            'content' => $content,
            'sources' => $sources
        ];
    }

    /**
     * Generate content using regular GPT-4o (internal method with no retry logic)
     */
    private function generateContentInternal(string $topic, string $context): string
    {
        $gpt = $this->createGPTInstance('gpt-4.1-nano', 2000);

        $prompt = "Generate comprehensive content about: {$topic}\n\n";
        if (!empty($context)) {
            $prompt .= "Context: {$context}\n\n";
        }
        $prompt .= "Provide detailed information that would be useful for a presentation slide about this topic. ";
        $prompt .= "Include key points, explanations, and relevant details.";

        $gpt->addMessage('user', $prompt);
        $response = $gpt->getCompletion();
        $this->trackUsage($gpt);

        return $response;
    }

    /**
     * Step 3: Generate the final presentation with o4-mini (internal method with no retry logic)
     */
    private function generatePresentationInternal(string $title, string $message, array $researchedContent): array
    {
        $this->updateStatus('generating', 'Creating final presentation structure and slides from researched content...');

        $gpt = $this->createGPTInstance('o4-mini');
        $gpt->setResponseFormat('json_object');

        $prompt = $this->createPresentationPrompt($title, $message, $researchedContent);
        $gpt->addMessage('user', $prompt);

        $this->updateStatus('generating', 'Processing AI request for final presentation generation...');
        $response = $gpt->getCompletion();
        $this->trackUsage($gpt);

        // Check for empty response first
        if (empty(trim($response))) {
            $errorMsg = 'Empty response from AI service (model: o4-mini)';
            error_log("=== EMPTY RESPONSE ERROR IN generatePresentationInternal() ===");
            error_log("Response length: " . strlen($response));
            error_log("Model: o4-mini");
            error_log("=== END EMPTY RESPONSE ERROR LOG ===");

            $this->updateStatus('failed', $errorMsg);
            throw new \Exception($errorMsg);
        }

        $this->updateStatus('generating', 'Parsing and validating presentation structure...');

        // Clean and parse the response
        $presentationData = json_decode($response, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $jsonError = json_last_error_msg();
            $errorMsg = 'Error parsing final presentation from AI response: ' . $jsonError;

            // Always save debug file for JSON parsing errors
            $debugFile = $this->saveResponseForDebugging($response, 'presentation_generation', $jsonError);

            // Enhanced logging with more details
            error_log("=== JSON PARSING ERROR IN generatePresentationInternal() ===");
            error_log("JSON Error: " . $jsonError);
            error_log("JSON Error Code: " . json_last_error());
            error_log("Original response length: " . strlen($response));
            error_log("Debug file saved: " . ($debugFile ?: 'FAILED TO SAVE'));

            // Look for common issues in the cleaned response
            $issues = [];
            if (!empty($issues)) {
                error_log("Detected issues: " . implode(', ', $issues));
            }

            error_log("=== END JSON PARSING ERROR LOG ===");

            // Update status with debug file info
            $statusMsg = $errorMsg;
            if ($debugFile) {
                $statusMsg .= " (Debug file saved: " . basename($debugFile) . ")";
            }
            $this->updateStatus('failed', $statusMsg);

            throw new \Exception('Invalid JSON response from presentation generation: ' . $jsonError);
        }

        // Validate and clean the presentation structure
        $this->updateStatus('generating', 'Validating presentation structure and content...');

        try {
            $this->validatePresentationStructure($presentationData);
        } catch (\Exception $e) {
            // If validation fails, save debug info but continue
            $debugFile = $this->saveResponseForDebugging($response, 'validation_failed', $e->getMessage());
            error_log("Presentation validation failed, debug file: " . ($debugFile ?: 'FAILED TO SAVE'));
            error_log("Validation error: " . $e->getMessage());

            // Continue with unvalidated data - better than failing completely
            $this->updateStatus('generating', 'Validation failed but continuing with unvalidated data...');
        }

        // Clean any remaining formatting issues
        $presentationData = $this->cleanPresentationData($presentationData);

        $slideCount = count($presentationData);
        $this->updateStatus('generation_complete', "Presentation successfully generated with {$slideCount} slides.");

        return $presentationData;
    }



    /**
     * Create the prompt for content planning
     */
    private function createContentPlanningPrompt(string $title, string $message): string
    {
        return <<<PROMPT
You are a presentation planning expert. Analyze the following presentation request and create a detailed content plan.

Title: {$title}
Message/Content: {$message}

Create a comprehensive plan for what content is needed for this presentation. Consider what topics, facts, examples, statistics, or other information would make this presentation informative and engaging.

For each content item, determine if it needs to be searched for current/factual information or if it can be generated from general knowledge.

Return your response as JSON with this exact structure:

{
  "presentation_overview": "Brief description of what this presentation should cover",
  "target_audience": "Who this presentation is for",
  "key_themes": ["theme1", "theme2", "theme3"],
  "content_items": [
    {
      "topic": "Specific topic or section",
      "needs_search": true,
      "search_query": "Specific search query if needs_search is true",
      "context": "Additional context or specific angle to focus on",
      "slide_type": "title|bullet|text|image|code|quote|split|comparison",
      "priority": "high|medium|low"
    }
  ]
}

Rules:
- Include 6-10 content items for a comprehensive presentation
- Set needs_search to true for: current events, statistics, recent developments, factual data, market information, news, etc.
- Set needs_search to false for: general concepts, explanations, theoretical content, creative content, etc.
- Provide specific search queries when needs_search is true
- Suggest appropriate slide types for each content item
- Prioritize content items (high priority items will get more detailed treatment)

CRITICAL: Return ONLY valid JSON, no additional text or formatting.
PROMPT;
    }

    /**
     * Create the final presentation generation prompt
     */
    private function createPresentationPrompt(string $title, string $message, array $researchedContent): string
    {
        $researchText = "";
        foreach ($researchedContent as $item) {
            $researchText .= "Topic: {$item['topic']}\n";
            $researchText .= "Content: {$item['content']}\n";
            if (!empty($item['sources'])) {
                $researchText .= "Sources: " . implode('; ', $item['sources']) . "\n";
            }
            $researchText .= "---\n";
        }

        return <<<PROMPT
You are a professional presentation creator. Create a comprehensive presentation based on the following information:

Title: {$title}
Original Message: {$message}

RESEARCHED CONTENT:
{$researchText}

Create a presentation with 6-10 slides using the researched content above. 

CRITICAL JSON FORMATTING REQUIREMENTS:
- Return ONLY a valid JSON array
- Start with [ and end with ]
- NO additional text, explanations, or markdown code blocks
- Use double quotes for all strings
- Escape ALL special characters properly:
  * Newlines must be \\n
  * Quotes must be \"
  * Backslashes must be \\\\
  * Tabs must be \\t
- NO literal newlines in JSON strings
- Ensure proper JSON syntax with commas between array elements

SLIDE TYPES AND STRUCTURE:

1. TITLE slide:
{
  "type": "title",
  "title": "Your Title Here",
  "content": {
    "subtitle": "Optional subtitle"
  }
}

2. BULLET slide:
{
  "type": "bullet",
  "title": "Your Title Here",  
  "content": {
    "bullets": [
      {"text": "**Bold text** or regular text", "indent": 0},
      {"text": "Indented point", "indent": 1}
    ]
  }
}

3. TEXT slide:
{
  "type": "text",
  "title": "Your Title Here",
  "content": {
    "text": "Your detailed text content here.\\n\\nYou can use **bold text**, *italic text*, and even:\\n\\n- Bullet points\\n- Multiple lines\\n- Markdown formatting\\n\\n## Subheadings are also supported\\n\\nThis allows for much richer content presentation.",
    "sources": ["Source 1", "Source 2"]
  }
}

4. IMAGE slide:
{
  "type": "image",  
  "title": "Your Title Here",
  "content": {
    "url": "https://via.placeholder.com/800x600",
    "caption": "Optional caption"
  }
}

5. CODE slide:
{
  "type": "code",
  "title": "Your Title Here",
  "content": {
    "code": "console.log('Hello World');",
    "language": "javascript",
    "filename": "example.js"
  }
}

6. QUOTE slide:
{
  "type": "quote",
  "title": "Your Title Here", 
  "content": {
    "quote": "Your inspirational quote here.\\n\\nYou can use **bold** and *italic* formatting in quotes\\nto emphasize important parts.",
    "author": "Author Name",
    "source": "Source/Context"
  }
}

7. SPLIT slide:
{
  "type": "split",
  "title": "Your Title Here",
  "content": {
    "leftContent": "Content for the left side.\\n\\nYou can use:\\n- **Bold text**\\n- *Italic text*\\n- Multiple paragraphs\\n- Lists and other markdown",
    "rightContent": "Content for the right side.\\n\\n## Subheadings work too\\n\\nThis allows for rich formatting on both sides of the split."
  }
}

8. COMPARISON slide:
{
  "type": "comparison",
  "title": "Your Title Here",
  "content": {
    "leftTitle": "Left Column Title",
    "rightTitle": "Right Column Title", 
    "leftItems": ["**Strong benefit** with details", "*Italic emphasis* on key point", "Regular item with\\nmultiple lines"],
    "rightItems": ["**Bold disadvantage**", "*Emphasized concern*", "Another point with\\nline breaks allowed"]
  }
}

CONTENT GUIDELINES:
- Use the researched content to create accurate, informative slides
- Every slide MUST have "type" and "title" fields
- Include specific facts, statistics, and details from the researched content
- For text slides based on researched content with sources, include the "sources" array
- Create an engaging flow from introduction to conclusion
- Use markdown formatting: **bold**, *italic*, ## headers, - lists, > quotes, etc.
- For multi-line content, use \\n to separate lines
- For bullet slides, each bullet can contain markdown
- For text slides, use multi-paragraph content with markdown formatting

EXAMPLE VALID OUTPUT:
[{"type":"title","title":"Presentation Title","content":{"subtitle":"Subtitle here"}},{"type":"text","title":"First Topic","content":{"text":"This is the first paragraph.\\n\\nThis is the second paragraph with **bold text** and *italic text*.\\n\\n- First bullet point\\n- Second bullet point","sources":["Source 1","Source 2"]}}]

CRITICAL: Your response must be ONLY the JSON array. Start with [ and end with ]. Any additional text will cause parsing errors.
PROMPT;
    }

    /**
     * Clean JSON response by removing markdown code blocks and basic formatting cleanup
     */
    private function cleanJsonResponse(string $response): string
    {
        // Remove BOM and trim whitespace
        $cleanResponse = trim(str_replace("\xEF\xBB\xBF", '', $response));

        // Remove markdown code blocks if present
        if (str_starts_with($cleanResponse, '```json')) {
            $cleanResponse = substr($cleanResponse, 7);
        } elseif (str_starts_with($cleanResponse, '```')) {
            $cleanResponse = substr($cleanResponse, 3);
        }

        if (str_ends_with($cleanResponse, '```')) {
            $cleanResponse = substr($cleanResponse, 0, -3);
        }

        // Trim again after removing code blocks
        $cleanResponse = trim($cleanResponse);

        // Since the prompt now asks for properly escaped JSON, we should do minimal processing
        // Only handle cases where the model might have added extra whitespace or formatting

        // Remove any trailing commas before closing brackets (common JSON error)
        $cleanResponse = preg_replace('/,(\s*[}\]])/', '$1', $cleanResponse);

        // Fix malformed escape sequences that the AI sometimes generates
        // These are common issues where the AI doesn't properly escape sequences in JSON strings
        $cleanResponse = preg_replace_callback(
            '/"([^"]*?)"/s',
            function ($matches) {
                $content = $matches[1];

                // Fix malformed newline escapes like "Split\ nX_train" -> "Split\\nX_train"
                $content = preg_replace('/\\\\(\s+)n/', '\\\\n', $content);

                // Fix standalone backslashes that should be escaped
                $content = preg_replace('/(?<!\\\\)\\\\(?![nrt"\\\\])/', '\\\\\\\\', $content);

                // Fix any remaining malformed escape sequences
                $content = str_replace(['\ n', '\ t', '\ r'], ['\\n', '\\t', '\\r'], $content);

                return '"' . $content . '"';
            },
            $cleanResponse
        );

        return $cleanResponse;
    }

    /**
     * Clean presentation data to remove any formatting issues
     */
    private function cleanPresentationData(array $presentationData): array
    {
        foreach ($presentationData as &$slide) {
            if (isset($slide['content'])) {
                $slide['content'] = $this->cleanSlideContent($slide['content']);
            }

            // Clean the title as well
            if (isset($slide['title'])) {
                $slide['title'] = $this->cleanStringContent($slide['title']);
            }
        }

        return $presentationData;
    }

    /**
     * Clean slide content recursively
     */
    private function cleanSlideContent($content)
    {
        if (is_string($content)) {
            return $this->cleanStringContent($content);
        } elseif (is_array($content)) {
            foreach ($content as &$item) {
                $item = $this->cleanSlideContent($item);
            }
            return $content;
        }

        return $content;
    }

    /**
     * Clean string content by preserving newlines and fixing encoding
     */
    private function cleanStringContent(string $content): string
    {
        // Preserve newlines but normalize line endings
        $content = str_replace(["\r\n", "\r"], ["\n", "\n"], $content);

        // Trim only leading/trailing whitespace, preserve internal formatting
        $content = trim($content);

        // Fix any remaining Unicode escape sequences that might have been missed
        $content = preg_replace_callback(
            '/\\\\u([0-9a-fA-F]{4})/',
            function ($matches) {
                try {
                    $codepoint = hexdec($matches[1]);
                    return mb_chr($codepoint, 'UTF-8');
                } catch (Exception) {
                    // If conversion fails, return the original sequence
                    return $matches[0];
                }
            },
            $content
        );

        return $content;
    }

    /**
     * Validate presentation structure
     */
    private function validatePresentationStructure(array $presentationData): void
    {
        if (!is_array($presentationData)) {
            throw new \Exception('Presentation data must be an array');
        }

        $validTypes = ['title', 'bullet', 'text', 'image', 'code', 'quote', 'split', 'comparison'];

        foreach ($presentationData as $index => $slide) {
            if (!isset($slide['type']) || !isset($slide['title'])) {
                throw new \Exception("Slide {$index} missing required 'type' or 'title' field");
            }

            if (!in_array($slide['type'], $validTypes)) {
                throw new \Exception("Slide {$index} has invalid type: {$slide['type']}");
            }

            $this->validateSlideContent($slide, $index);
        }
    }

    /**
     * Validate individual slide content
     */
    private function validateSlideContent(array $slide, int $index): void
    {
        $type = $slide['type'];
        $content = $slide['content'] ?? [];

        // Note: We now allow newlines and markdown in content for better formatting

        switch ($type) {
            case 'bullet':
                if (!isset($content['bullets']) || !is_array($content['bullets'])) {
                    throw new \Exception("Slide {$index} (bullet) missing or invalid 'bullets' array");
                }
                break;
            case 'text':
                if (!isset($content['text'])) {
                    throw new \Exception("Slide {$index} (text) missing 'text' field");
                }
                // Validate sources if present
                if (isset($content['sources']) && !is_array($content['sources'])) {
                    throw new \Exception("Slide {$index} (text) 'sources' field must be an array");
                }
                break;
            case 'image':
                if (!isset($content['url'])) {
                    throw new \Exception("Slide {$index} (image) missing 'url' field");
                }
                break;
            case 'code':
                if (!isset($content['code'])) {
                    throw new \Exception("Slide {$index} (code) missing 'code' field");
                }
                break;
            case 'quote':
                if (!isset($content['quote'])) {
                    throw new \Exception("Slide {$index} (quote) missing 'quote' field");
                }
                break;
            case 'split':
                if (!isset($content['leftContent']) || !isset($content['rightContent'])) {
                    throw new \Exception("Slide {$index} (split) missing 'leftContent' or 'rightContent' field");
                }
                break;
            case 'comparison':
                if (
                    !isset($content['leftTitle']) || !isset($content['rightTitle']) ||
                    !isset($content['leftItems']) || !isset($content['rightItems'])
                ) {
                    throw new \Exception("Slide {$index} (comparison) missing required fields");
                }
                break;
        }
    }

    /**
     * Track usage from a GPT instance
     */
    private function trackUsage(GPT $gpt): void
    {
        $this->totalCost += $gpt->getTotalCost();
        $this->totalInputTokens += $gpt->getTotalInputTokens();
        $this->totalOutputTokens += $gpt->getTotalOutputTokens();
    }

    /**
     * Reset usage tracking
     */
    private function resetUsage(): void
    {
        $this->totalCost = 0.0;
        $this->totalInputTokens = 0;
        $this->totalOutputTokens = 0;
    }

    /**
     * Get total cost for the presentation generation
     */
    public function getTotalCost(): float
    {
        return $this->totalCost;
    }

    /**
     * Get total input tokens used
     */
    public function getTotalInputTokens(): int
    {
        return $this->totalInputTokens;
    }

    /**
     * Get total output tokens used
     */
    public function getTotalOutputTokens(): int
    {
        return $this->totalOutputTokens;
    }

    /**
     * Create a GPT instance with proper parameters based on model type
     */
    private function createGPTInstance(string $model, int $maxTokens = 4000): GPT
    {
        $modelsWithoutTemperature = [
            // Reasoning models
            'o1-mini',
            'o1-preview',
            'o1',
            'o3-mini',
            'o3-preview',
            'o3',
            'o4-mini',
            'o4-preview',
            'o4',
            // Preview/special models that don't support temperature
            'gpt-4o-mini-search-preview'
        ];

        $supportsTemperature = !in_array($model, $modelsWithoutTemperature);

        if ($supportsTemperature) {
            // Standard models support temperature
            return new GPT($this->apiKeyPath, $model, 0.7, $maxTokens);
        } else {
            // Models that don't support temperature
            return new GPT($this->apiKeyPath, $model, 0.0, $maxTokens);
        }
    }
}

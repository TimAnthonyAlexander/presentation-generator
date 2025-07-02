# Presentation Generator

A minimalist presentation generator and viewer that creates beautiful, modern presentations from simple text descriptions.

## Project Structure

This project consists of two main parts:

1. **PHP Generator**: A PHP script that uses OpenAI's API to generate presentation slides based on a title and description.
2. **Web Viewer**: A React application to view the generated presentations.

## Setup

### PHP Generator Setup

1. Navigate to the PHP directory:
   ```
   cd php
   ```

2. Install dependencies with Composer:
   ```
   composer install
   ```

3. Set up your OpenAI API key:
   - Create a file `php/config/openai.txt`
   - Paste your OpenAI API key into this file (just the key, no additional content)

### Web Viewer Setup

1. Navigate to the web directory:
   ```
   cd web
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

### Generating a Presentation

You can generate a presentation in two ways:

#### Interactive Mode

Run the generator script without arguments to use interactive mode:

```
php generate.php
```

You will be prompted to enter:
- A presentation title
- A description of the content you want in the presentation

#### Command Line Arguments

```
php generate.php "Your Presentation Title" "Detailed description of what you want in your presentation" [output_filename.json]
```

The output filename is optional. If not provided, a filename will be generated based on the title.

### Viewing a Presentation

1. Start the web viewer:
   ```
   cd web
   npm start
   ```

2. Use one of the following methods to view your presentation:

   - **Upload file**: Click the "Upload Presentation JSON" button and select your generated JSON file.
   
   - **URL parameter**: Open the viewer with a URL like:
     ```
     http://localhost:3000?file=path/to/your/presentation.json
     ```

## Example

1. Generate a presentation:
   ```
   php generate.php "Introduction to AI" "Create a presentation about artificial intelligence. Cover the history of AI, different types of AI (narrow vs general), machine learning basics, neural networks, and future trends. Include some real-world applications."
   ```

2. View the presentation in the web viewer.

## Notes

- The generator uses GPT-4o to create presentations, which requires an OpenAI API key with appropriate permissions.
- The presentation format is a JSON array of slide objects that can be viewed with the included viewer.
- Double-click anywhere in presentation mode to exit back to the viewer interface.

## Customization

You can adjust various parameters in the generator and viewer to customize the experience:

- Modify `php/src/PresentationService.php` to change how content is researched and generated.
- Edit the React components in the `web/src/presenter` directory to change the appearance of different slide types. 
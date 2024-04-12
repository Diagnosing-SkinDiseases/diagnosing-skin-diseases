# Changing Webpage Styles

## Introduction
This guide provides step-by-step instructions on how to change the theme of your webpage by modifying CSS variables. These changes affect the overall look and feel of the site, including colors, fonts, and other stylistic elements.

## Accessing the Theme Settings
To change the theme settings of your webpage, follow these steps:

**Navigate to the Source Code:**
   - Open the frontend project folder on your computer.
   - Go to the `src` folder.
   - Navigate to the `components` folder.
   - Open the `CSS` folder where the main styling sheet is located, named `App.css`.


## Theme Variables Explained

Here are the CSS variables used to define the website's theme, each targeting different elements of the UI:

### Fonts
- `--primary-font`: Default font for the webpage. Example usage: `"Roboto"`.

### Backgrounds
- `--back_ground`: Main background color of the website. Example color: `#eee9df`.
- `--background-image`: (Commented out) Path to the background image if used.

### Navbar
- `--nav-back_ground`: Background color of the navbar. Example color: `#e4ddd0`.
- `--nav-hover`: Navbar item hover color. Example color: `#d0be9f`.
- `--nav-text`: Color of text in the navbar. Example color: `#715529`.
- `--nav-text-hover`: Text color on hover in the navbar. Example color: `#fefefe`.

### Footer
- `--footer`: Background color of the footer. Example color: `#e4ddd0`.

### Buttons
- `--btn-color`: Button background color. Example color: `#927448`.
- `--btn-color-hover`: Button background color on hover. Example color: `#715529`.
- `--btn-text-color`: Color of text on buttons. Example color: `white`.

### Article List & Glossary
- `--glossary-hightlight`: Highlight color of selected glossary terms. Example color: `#927448`.
- `--selecter-banner`: Background color of alphabet banner. Example color: `#baa57f`.
- `--banner`: Letter banner background color. Example color: `#baa57f`.

### Page Elements
- `--title-text`: Color for titles on the page. Example color: `#715529`.
- `--header-text`: Color for headers on the page. Example color: `#715529`.
- `--header`: Background color for headers. Example color: `#eee9df`.

### Tree Elements
- `--border`: Border color for tree elements. Example color: `#715529`.
- `--box-color`: Background color of boxes. Example color: `white`.

### Card Elements
- `--card-color`: Background color of homepage cards. Example color: `#e4ddd0`.
- `--card-title`: Color of card title. Example color: `#715529`.
- `--card-border`: Border color of cards. Example color: `#715529`.

### Text & Misc
- `--text`: General text color. Example color: `#715529`.
- `--placeholder-text`: Color of placeholder texts in input fields. Example color: `#aaa`.
- `--error-message`: Color of error messages. Example color: `red`.
- `--login-container`: Background color of the login container. Example color: `#f5f5f5`.

## Applying Changes

1. **Locate CSS File**: Open your project and navigate to `App.css`.
2. **Modify Variables**: Adjust the values of the variables in the `:root` selector to change the theme.
3. **Save and Test**: After making changes, save the file and refresh your website to see the effects.

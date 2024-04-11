# Linking Articles Guide

## Table of Contents

- [Link to Another Article (General Step)](#1-link-to-another-article-general-step)
- [Link to Another Article (Same Browser Tab)](#2-link-to-another-article-same-browser-tab)
- [Link to Another Article (New Browser Tab)](#3-link-to-another-article-new-browser-tab)
- [Link to a Specific Place in Another Article](#4-link-to-a-specific-place-in-another-article)

***
### **Link to Another Article (General Step)**
To create a link to another article use the following template:

```html
<a href="LINK-TO-THE-ARTICLE">TEXT-TO-DISPLAY</a>
```

#### 1.1. Insert Link Text
Between the opening `<a>` tag and the closing `</a>` tag, type the text to be displayed as the clickable link.

#### 1.2. Specify the Link URL
Inside the quotation marks of the href attribute, paste or type the URL of the article or page to link to. This URL is the destination of the link.
***
### **Link to Another Article (Same Browser Tab)**

To create a link that opens in the same browser tab, use the `target="_self_"` attribute.


```html
<a href="LINK-TO-THE-ARTICLE" target="_self">TEXT-TO-DISPLAY</a>
```

**Example:**

```html
DIAGNOSIS: Vitiligo.<br>
<a href="https://diagnosing-skin-diseases.vercel.app/treatment/vitiligo/660525a2de64816625be7be5" target="_self">Click here to view article.</a>
```
***
###  **Link to Another Article (New Browser Tab)**

To make a link open in a new browser tab, use the `target="_blank"` attribute. 


```html
<a href="LINK-TO-THE-ARTICLE" target="_blank">TEXT-TO-DISPLAY</a>
```

**Example:**

```html
DIAGNOSIS: Vitiligo.<br>
<a href="https://diagnosing-skin-diseases.vercel.app/treatment/vitiligo/660525a2de64816625be7be5" target="_blank">Click here to view article.</a>
```
***
### **Link to a Specific Place in Another Article**

For linking directly to a specific section within another article, ensure that the target location has a unique `id`. Then, create a link pointing to that `id`.

#### 1. Setting an ID:

This will need to be done using HTML within the article that you're linking to.

```html
<span id="UNIQUE-ID">TARGET WORD</span>
```

**Example:**

```html
<span id="vitiligo-treatment">Treatment</span>
```

#### 2. Linking to the ID

When creating a link to this specific place, you'll use HTML to include the `id` in the link URL.

```html
<a href="LINK-TO-THE-ARTICLE#ID" target="_blank">TEXT-TO-DISPLAY</a>
```

**Example:**

```html
<a href="https://diagnosing-skin-diseases.vercel.app/treatment/vitiligo/660525a2de64816625be7be5#treatment" target="_self">Read about the treatment</a>
```
